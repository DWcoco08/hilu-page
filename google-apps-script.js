/**
 * Google Apps Script để sync data từ Cloudflare Worker vào Google Sheet
 *
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Mở Google Sheet mới hoặc có sẵn
 * 2. Vào Extensions > Apps Script
 * 3. Copy toàn bộ code này vào Apps Script editor
 * 4. Lưu file (Ctrl+S hoặc Cmd+S)
 * 5. Chạy hàm syncContactsFromWorker() để sync data
 *
 * AUTO SYNC MẶC ĐỊNH: 7h sáng mỗi ngày
 * - Dùng menu "📅 Setup Auto Sync (mỗi ngày)" để kích hoạt
 * - Hoặc setup tự động khi chạy lần đầu
 */

// URL của Cloudflare Worker endpoint
const WORKER_API_URL = "https://hilu-website.btt7m8gzm7.workers.dev/data/json";

/**
 * Hàm chính để sync data từ Worker vào Sheet
 */
function syncContactsFromWorker() {
  try {
    // Gọi API để lấy data
    console.log("Fetching data from Worker API...");
    const response = UrlFetchApp.fetch(WORKER_API_URL, {
      method: "GET",
      muteHttpExceptions: true,
      headers: {
        Accept: "application/json",
      },
    });

    // Parse JSON response
    const responseCode = response.getResponseCode();
    if (responseCode !== 200) {
      throw new Error(
        `API returned status ${responseCode}: ${response.getContentText()}`
      );
    }

    const jsonData = JSON.parse(response.getContentText());
    console.log(`Received ${jsonData.count} records from API`);

    // Kiểm tra data structure
    if (!jsonData.success || !jsonData.data) {
      throw new Error("Invalid data structure received from API");
    }

    const contacts = jsonData.data;

    // Nếu không có data, thông báo và dừng
    if (contacts.length === 0) {
      SpreadsheetApp.getUi().alert("Không có dữ liệu để import");
      return;
    }

    // Lấy active spreadsheet và sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getActiveSheet();

    // Clear sheet cũ (giữ lại tên sheet)
    sheet.clear();

    // Tạo headers
    const headers = [
      "ID",
      "Tên",
      "Email",
      "Tin nhắn",
      "Ngày tạo",
      "IP Address",
      "User Agent",
    ];

    // Set headers với format
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setBackground("#4CAF50");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");

    // Chuẩn bị data rows
    const dataRows = contacts.map((contact) => [
      contact.id || "",
      contact.name || "",
      contact.email || "",
      contact.message || "",
      contact.created_at || "",
      contact.ip_address || "",
      contact.user_agent || "",
    ]);

    // Set data vào sheet
    if (dataRows.length > 0) {
      const dataRange = sheet.getRange(2, 1, dataRows.length, headers.length);
      dataRange.setValues(dataRows);
    }

    // Format sheet
    formatSheet(sheet, dataRows.length + 1);

    // Log và thông báo thành công
    console.log(`Successfully imported ${contacts.length} records`);
    SpreadsheetApp.getUi().alert(
      `Đã import thành công ${contacts.length} bản ghi từ Cloudflare Worker!`
    );
  } catch (error) {
    console.error("Error syncing data:", error);
    SpreadsheetApp.getUi().alert("Lỗi: " + error.toString());
  }
}

/**
 * Format sheet cho đẹp
 */
function formatSheet(sheet, rowCount) {
  // Auto resize columns
  sheet.autoResizeColumns(1, 7);

  // Set column widths cụ thể
  sheet.setColumnWidth(1, 50); // ID
  sheet.setColumnWidth(2, 150); // Tên
  sheet.setColumnWidth(3, 200); // Email
  sheet.setColumnWidth(4, 300); // Tin nhắn
  sheet.setColumnWidth(5, 150); // Ngày tạo
  sheet.setColumnWidth(6, 120); // IP
  sheet.setColumnWidth(7, 250); // User Agent

  // Freeze header row
  sheet.setFrozenRows(1);

  // Add borders
  if (rowCount > 0) {
    const allDataRange = sheet.getRange(1, 1, rowCount, 7);
    allDataRange.setBorder(true, true, true, true, true, true);
  }

  // Alternate row colors
  if (rowCount > 1) {
    const dataRange = sheet.getRange(2, 1, rowCount - 1, 7);
    dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  }
}

/**
 * Menu item để dễ chạy
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("🔄 Sync Data")
    .addItem("▶️ Sync Ngay", "syncContactsFromWorker")
    .addSeparator()
    .addItem("⏱️ Setup Auto Sync (mỗi 30 phút)", "setupHalfHourlyTrigger")
    .addItem("⏱️ Setup Auto Sync (mỗi giờ)", "setupHourlyTrigger")
    .addItem("📅 Setup Auto Sync (mỗi ngày)", "setupDailyTrigger")
    .addItem("📅 Setup Auto Sync (mỗi tuần)", "setupWeeklyTrigger")
    .addSeparator()
    .addItem("🔍 Xem Triggers Hiện Tại", "showCurrentTriggers")
    .addItem("❌ Xóa Tất Cả Auto Sync", "deleteTriggers")
    .addSeparator()
    .addItem("🧪 Test Connection", "testConnection")
    .addItem("📊 Thống Kê Database", "showDatabaseStats")
    .addToUi();
}

/**
 * Setup trigger tự động sync mỗi 30 phút
 */
function setupHalfHourlyTrigger() {
  // Xóa triggers cũ
  deleteTriggers();

  // Tạo trigger mới
  ScriptApp.newTrigger("syncContactsFromWorker")
    .timeBased()
    .everyMinutes(30)
    .create();

  SpreadsheetApp.getUi().alert("✅ Đã setup auto sync mỗi 30 phút!");
}

/**
 * Setup trigger tự động sync mỗi giờ
 */
function setupHourlyTrigger() {
  // Xóa triggers cũ
  deleteTriggers();

  // Tạo trigger mới
  ScriptApp.newTrigger("syncContactsFromWorker")
    .timeBased()
    .everyHours(1)
    .create();

  SpreadsheetApp.getUi().alert("✅ Đã setup auto sync mỗi giờ!");
}

/**
 * Setup trigger tự động sync mỗi ngày (MẶC ĐỊNH: 7h sáng)
 */
function setupDailyTrigger() {
  // Xóa triggers cũ
  deleteTriggers();

  // Tạo trigger mới - chạy lúc 7h sáng mỗi ngày (giờ Việt Nam)
  ScriptApp.newTrigger("syncContactsFromWorker")
    .timeBased()
    .atHour(7)
    .everyDays(1)
    .create();

  SpreadsheetApp.getUi().alert("✅ Đã setup auto sync mỗi ngày lúc 7h sáng!");
}

/**
 * Setup trigger tự động sync mỗi tuần
 */
function setupWeeklyTrigger() {
  // Xóa triggers cũ
  deleteTriggers();

  // Tạo trigger mới - chạy vào thứ 2 hàng tuần lúc 7h sáng
  ScriptApp.newTrigger("syncContactsFromWorker")
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(7)
    .create();

  SpreadsheetApp.getUi().alert("✅ Đã setup auto sync mỗi thứ 2 lúc 7h sáng!");
}

/**
 * Xóa tất cả triggers
 */
function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((trigger) => {
    if (trigger.getHandlerFunction() === "syncContactsFromWorker") {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

/**
 * Test connection đến API
 */
function testConnection() {
  try {
    const response = UrlFetchApp.fetch(WORKER_API_URL, {
      method: "GET",
      muteHttpExceptions: true,
    });

    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      SpreadsheetApp.getUi().alert(
        `✅ Kết nối thành công!\n\n` +
        `📊 Tổng số bản ghi: ${data.count}\n` +
        `⏰ Thời gian server: ${data.timestamp}`
      );
    } else {
      SpreadsheetApp.getUi().alert(
        `❌ Lỗi kết nối: Status ${response.getResponseCode()}`
      );
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert("❌ Lỗi kết nối: " + error.toString());
  }
}

/**
 * Hiển thị triggers hiện tại
 */
function showCurrentTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  const syncTriggers = triggers.filter(trigger =>
    trigger.getHandlerFunction() === "syncContactsFromWorker"
  );

  if (syncTriggers.length === 0) {
    SpreadsheetApp.getUi().alert(
      "📭 Hiện tại không có Auto Sync nào được cài đặt.\n\n" +
      "Vui lòng chọn một trong các tùy chọn Auto Sync từ menu."
    );
    return;
  }

  let message = "📋 Triggers hiện tại:\n\n";
  syncTriggers.forEach((trigger, index) => {
    const type = trigger.getEventType();
    message += `${index + 1}. ${type}\n`;
  });

  SpreadsheetApp.getUi().alert(message);
}

/**
 * Thống kê database
 */
function showDatabaseStats() {
  try {
    const response = UrlFetchApp.fetch(WORKER_API_URL, {
      method: "GET",
      muteHttpExceptions: true,
    });

    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      const contacts = data.data;

      // Tính toán thống kê
      const today = new Date();
      const todayContacts = contacts.filter(c => {
        const contactDate = new Date(c.created_at);
        return contactDate.toDateString() === today.toDateString();
      }).length;

      const thisWeek = contacts.filter(c => {
        const contactDate = new Date(c.created_at);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return contactDate > weekAgo;
      }).length;

      const thisMonth = contacts.filter(c => {
        const contactDate = new Date(c.created_at);
        return contactDate.getMonth() === today.getMonth() &&
               contactDate.getFullYear() === today.getFullYear();
      }).length;

      SpreadsheetApp.getUi().alert(
        `📊 THỐNG KÊ DATABASE\n\n` +
        `📈 Tổng số contacts: ${data.count}\n` +
        `📅 Hôm nay: ${todayContacts} contacts\n` +
        `📅 7 ngày qua: ${thisWeek} contacts\n` +
        `📅 Tháng này: ${thisMonth} contacts\n\n` +
        `⏰ Cập nhật lúc: ${new Date().toLocaleString('vi-VN')}`
      );
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert("❌ Lỗi lấy thống kê: " + error.toString());
  }
}
