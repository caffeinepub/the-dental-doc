interface PatientPDFData {
  registrationNumber: string;
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  address: string;
  phoneNumber: string;
}

export function generatePatientPDF(data: PatientPDFData): void {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to print the patient case paper');
    return;
  }

  // Generate HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Patient Case Paper - ${data.registrationNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, Helvetica, sans-serif;
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
          background: white;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        
        .header {
          background-color: #00BCD4;
          color: white;
          padding: 12px 20px;
          text-align: center;
          flex-shrink: 0;
        }
        
        .header h1 {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 2px;
          color: white;
        }
        
        .content {
          flex: 1;
          padding: 15px 30px 20px 30px;
          display: flex;
          flex-direction: column;
        }
        
        .patient-details {
          margin-bottom: 15px;
          flex-shrink: 0;
        }
        
        .detail-row {
          margin-bottom: 6px;
          display: flex;
          font-size: 11px;
        }
        
        .detail-label {
          font-weight: bold;
          width: 130px;
          flex-shrink: 0;
        }
        
        .detail-value {
          flex: 1;
        }
        
        .registration-number {
          font-size: 12px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 2px solid #00BCD4;
        }
        
        .registration-number .detail-label {
          color: #00BCD4;
        }
        
        .separator {
          border-top: 1px solid #ddd;
          margin: 12px 0;
          flex-shrink: 0;
        }
        
        .clinical-notes {
          margin-top: 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .clinical-notes h2 {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
          flex-shrink: 0;
        }
        
        .notes-lines {
          line-height: 22px;
          flex: 1;
        }
        
        .notes-line {
          border-bottom: 1px solid #e0e0e0;
          height: 22px;
        }
        
        .footer {
          padding: 12px 30px;
          border-top: 2px solid #00BCD4;
          background: white;
          font-size: 9px;
          flex-shrink: 0;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          gap: 30px;
        }
        
        .footer-left, .footer-right {
          flex: 1;
        }
        
        .footer-right {
          text-align: right;
        }
        
        .footer h3 {
          font-size: 10px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #00BCD4;
        }
        
        .footer p {
          margin-bottom: 2px;
          line-height: 1.4;
          color: #333;
        }
        
        @media print {
          body {
            width: 100%;
            height: 100vh;
            margin: 0;
          }
          
          @page {
            margin: 0;
            size: A4 portrait;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>THE DENTAL DOC</h1>
      </div>
      
      <div class="content">
        <div class="patient-details">
          <div class="detail-row registration-number">
            <span class="detail-label">Registration Number:</span>
            <span class="detail-value">${data.registrationNumber}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Patient Name:</span>
            <span class="detail-value">${data.firstName} ${data.lastName}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Age:</span>
            <span class="detail-value">${data.age} years</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Gender:</span>
            <span class="detail-value">${data.gender}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Address:</span>
            <span class="detail-value">${data.address}</span>
          </div>
          
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${data.phoneNumber}</span>
          </div>
        </div>
        
        <div class="separator"></div>
        
        <div class="clinical-notes">
          <h2>Clinical Notes:</h2>
          <div class="notes-lines">
            ${Array(20).fill(0).map(() => '<div class="notes-line"></div>').join('')}
          </div>
        </div>
      </div>
      
      <div class="footer">
        <div class="footer-content">
          <div class="footer-left">
            <h3>Clinic Information</h3>
            <p><strong>The Dental Doc</strong></p>
            <p>Shop No. 137, First Floor, Gera Imperium</p>
            <p>Next to The Gera School, Kadmaba Plateau, Goa</p>
            <p><strong>Phone:</strong> +91-7020391073</p>
            <p><strong>Hours:</strong> 10:30 AM - 7:30 PM</p>
            <p style="font-size: 8px; color: #666;">Sundays Closed</p>
          </div>
          
          <div class="footer-right">
            <h3>Doctor Information</h3>
            <p><strong>Dr. Chandrakant Sharma</strong></p>
            <p>Reg No: A-1340</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Write content to the new window
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      // Close the window after printing (user can cancel)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 250);
  };
}
