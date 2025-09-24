/**
 * Google Apps Script để sync data từ Cloudflare Worker (hilu.workers.dev) vào Google Sheet
 *
 * Hướng dẫn sử dụng:
 * 1. Mở Google Sheet mới hoặc có sẵn
 * 2. Vào Extensions > Apps Script
 * 3. Copy toàn bộ code này vào Apps Script editor
 * 4. Lưu file (Ctrl+S hoặc Cmd+S)
 * 5. Chạy hàm syncContactsFromWorker() để sync data
 * 6. (Optional) Tạo trigger tự động: Vào Triggers > Add Trigger > chọn syncContactsFromWorker
 */

// URL của Cloudflare Worker endpoint
const WORKER_API_URL = 'https://hilu-website.btt7m8gzm7.workers.dev/data/json';

/**
 * Hàm chính để sync data từ Worker vào Sheet
 */
function syncContactsFromWorker() {
  try {
    // Gọi API để lấy data
    console.log('Fetching data from Worker API...');
    const response = UrlFetchApp.fetch(WORKER_API_URL, {
      'method': 'GET',
      'muteHttpExceptions': true,
      'headers': {
        'Accept': 'application/json'
      }
    });

    // Parse JSON response
    const responseCode = response.getResponseCode();
    if (responseCode !== 200) {
      throw new Error(`API returned status ${responseCode}: ${response.getContentText()}`);
    }

    const jsonData = JSON.parse(response.getContentText());
    console.log(`Received ${jsonData.count} records from API`);

    // Kiểm tra data structure
    if (!jsonData.success || !jsonData.data) {
      throw new Error('Invalid data structure received from API');
    }

    const contacts = jsonData.data;

    // Nếu không có data, thông báo và dừng
    if (contacts.length === 0) {
      SpreadsheetApp.getUi().alert('Không có dữ liệu để import');
      return;
    }

    // Lấy active spreadsheet và sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getActiveSheet();

    // Clear sheet cũ (giữ lại tên sheet)
    sheet.clear();

    // Tạo headers
    const headers = [
      'ID',
      'Tên',
      'Email',
      'Tin nhắn',
      'Ngày tạo',
      'IP Address',
      'User Agent'
    ];

    // Set headers với format
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setBackground('#4CAF50');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');

    // Chuẩn bị data rows
    const dataRows = contacts.map(contact => [
      contact.id || '',
      contact.name || '',
      contact.email || '',
      contact.message || '',
      contact.created_at || '',
      contact.ip_address || '',
      contact.user_agent || ''
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
    SpreadsheetApp.getUi().alert(`Đã import thành công ${contacts.length} bản ghi từ Cloudflare Worker!`);

  } catch (error) {
    console.error('Error syncing data:', error);
    SpreadsheetApp.getUi().alert('Lỗi: ' + error.toString());
  }
}

/**
 * Format sheet cho đẹp
 */
function formatSheet(sheet, rowCount) {
  // Auto resize columns
  sheet.autoResizeColumns(1, 7);

  // Set column widths cụ thể
  sheet.setColumnWidth(1, 50);   // ID
  sheet.setColumnWidth(2, 150);  // Tên
  sheet.setColumnWidth(3, 200);  // Email
  sheet.setColumnWidth(4, 300);  // Tin nhắn
  sheet.setColumnWidth(5, 150);  // Ngày tạo
  sheet.setColumnWidth(6, 120);  // IP
  sheet.setColumnWidth(7, 250);  // User Agent

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
  ui.createMenu('🔄 Sync Data')
    .addItem('Sync từ Cloudflare Worker', 'syncContactsFromWorker')
    .addSeparator()
    .addItem('Setup Auto Sync (mỗi giờ)', 'setupHourlyTrigger')
    .addItem('Setup Auto Sync (mỗi ngày)', 'setupDailyTrigger')
    .addItem('Xóa Auto Sync', 'deleteTriggers')
    .addToUi();
}

/**
 * Setup trigger tự động sync mỗi giờ
 */
function setupHourlyTrigger() {
  // Xóa triggers cũ
  deleteTriggers();

  // Tạo trigger mới
  ScriptApp.newTrigger('syncContactsFromWorker')
    .timeBased()
    .everyHours(1)
    .create();

  SpreadsheetApp.getUi().alert('Đã setup auto sync mỗi giờ!');
}

/**
 * Setup trigger tự động sync mỗi ngày
 */
function setupDailyTrigger() {
  // Xóa triggers cũ
  deleteTriggers();

  // Tạo trigger mới - chạy lúc 9h sáng mỗi ngày
  ScriptApp.newTrigger('syncContactsFromWorker')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .create();

  SpreadsheetApp.getUi().alert('Đã setup auto sync mỗi ngày lúc 9h sáng!');
}

/**
 * Xóa tất cả triggers
 */
function deleteTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'syncContactsFromWorker') {
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
      'method': 'GET',
      'muteHttpExceptions': true
    });

    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      SpreadsheetApp.getUi().alert(`Kết nối thành công! Tìm thấy ${data.count} bản ghi.`);
    } else {
      SpreadsheetApp.getUi().alert(`Lỗi kết nối: Status ${response.getResponseCode()}`);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Lỗi kết nối: ' + error.toString());
  }
}