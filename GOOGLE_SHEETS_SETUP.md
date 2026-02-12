# Google Sheets Integration Setup Guide

This guide will help you connect your form to Google Sheets to track submissions and button clicks.

## Step 1: Create Google Apps Script

1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1vV14LKZUEdVCYxcdoZgvJ7bXvK7picvC6K4yKM2Pdug/edit

2. Click **Extensions** > **Apps Script**

3. Delete any existing code and paste the following:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FreeJobAd');
    
    // Get form data
    const timestamp = e.parameter.timestamp || new Date().toISOString();
    const companyName = e.parameter.company_name || '';
    const email = e.parameter.email || '';
    const phoneNumber = e.parameter.phone_number || '';
    const hiringStatus = e.parameter.hiring_status || '';
    const clickLogin = e.parameter.click_login || '';
    const clickRegister = e.parameter.click_register || '';
    
    // Append data to sheet
    sheet.appendRow([
      timestamp,
      companyName,
      email,
      phoneNumber,
      hiringStatus,
      clickLogin,
      clickRegister
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data recorded successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾 icon)

## Step 2: Deploy as Web App

1. Click **Deploy** > **New deployment**

2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**

3. Configure the deployment:
   - **Description**: "Form Tracker"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone

4. Click **Deploy**

5. Review permissions and click **Authorize access**

6. Copy the **Web app URL** (it will look like: `https://script.google.com/macros/s/XXXXX/exec`)

## Step 3: Set Up Your Sheet Headers

Make sure your Google Sheet has the following headers in Row 1:

```
timestamp | company_name | email | phone_number | hiring_status | click_login | click_register
```

## Step 4: Configure Environment Variable

1. In your v0 project, go to the **Vars** section in the sidebar

2. Add a new environment variable:
   - **Key**: `VITE_GOOGLE_SHEETS_WEBHOOK`
   - **Value**: The Web app URL you copied in Step 2

3. Save the environment variable

## Step 5: Test the Integration

1. Submit the form on your website
2. Check your Google Sheet - you should see a new row with the submission data
3. Click the Login or Register buttons in the success modal
4. Check your Google Sheet - you should see additional rows tracking the button clicks

## Data Structure

Each row in your Google Sheet will contain:

- **timestamp**: ISO 8601 date/time of the event
- **company_name**: Company name from the form
- **email**: Email address from the form
- **phone_number**: Phone number with country code (+60)
- **hiring_status**: Selected hiring preference
- **click_login**: "yes" if login button was clicked, "no" otherwise
- **click_register**: "yes" if register button was clicked, "no" otherwise

## Troubleshooting

If data is not being recorded:

1. Check that the Apps Script deployment is set to "Anyone" access
2. Verify the Web app URL in your environment variables
3. Check the Apps Script execution logs: Extensions > Apps Script > Executions
4. Make sure the sheet headers match exactly
5. Open browser console to see any error messages

## Security Notes

- The service account email (ajobthing-promo@christmas-promo.iam.gserviceaccount.com) should have Editor access to the Google Sheet
- The Web app is publicly accessible but only accepts POST requests
- All data is sent over HTTPS
