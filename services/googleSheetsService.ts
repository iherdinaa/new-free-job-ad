interface SheetData {
  timestamp: string;
  company_name: string;
  email: string;
  phone_number: string;
  hiring_status: string;
  click_login: 'yes' | 'no' | '';
  click_register: 'yes' | 'no' | '';
}

const SPREADSHEET_ID = '1vV14LKZUEdVCYxcdoZgvJ7bXvK7picvC6K4yKM2Pdug';

export const sendToGoogleSheets = async (data: SheetData): Promise<boolean> => {
  try {
    // Use Google Sheets API via Apps Script Web App or direct API
    // For now, we'll use a Web App deployment from Google Apps Script
    
    const formData = new FormData();
    formData.append('timestamp', data.timestamp);
    formData.append('company_name', data.company_name);
    formData.append('email', data.email);
    formData.append('phone_number', data.phone_number);
    formData.append('hiring_status', data.hiring_status);
    formData.append('click_login', data.click_login);
    formData.append('click_register', data.click_register);

    // Note: You'll need to deploy a Google Apps Script Web App
    // See instructions below for the deployment URL
    const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK || '';
    
    if (!APPS_SCRIPT_URL) {
      console.warn('[v0] Google Sheets webhook URL not configured');
      return false;
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('[v0] Data sent to Google Sheets successfully');
      return true;
    } else {
      console.error('[v0] Failed to send data to Google Sheets:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('[v0] Error sending data to Google Sheets:', error);
    return false;
  }
};

export const trackFormSubmission = async (
  companyName: string,
  email: string,
  phoneNumber: string,
  hiringStatus: string
): Promise<void> => {
  const data: SheetData = {
    timestamp: new Date().toISOString(),
    company_name: companyName,
    email: email,
    phone_number: phoneNumber,
    hiring_status: hiringStatus,
    click_login: '',
    click_register: '',
  };

  await sendToGoogleSheets(data);
};

export const trackButtonClick = async (
  companyName: string,
  email: string,
  phoneNumber: string,
  hiringStatus: string,
  buttonType: 'login' | 'register'
): Promise<void> => {
  const data: SheetData = {
    timestamp: new Date().toISOString(),
    company_name: companyName,
    email: email,
    phone_number: phoneNumber,
    hiring_status: hiringStatus,
    click_login: buttonType === 'login' ? 'yes' : 'no',
    click_register: buttonType === 'register' ? 'yes' : 'no',
  };

  await sendToGoogleSheets(data);
};
