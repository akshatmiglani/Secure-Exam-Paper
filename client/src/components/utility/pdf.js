import React from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'; // Import degrees from pdf-lib

class AddWatermark extends React.Component {
  handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Embed the font for the watermark
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const watermarkText = 'CONFIDENTIAL'; // Watermark text

      // Iterate through all pages
      const pages = pdfDoc.getPages();
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        // Add watermark to the page
        page.drawText(watermarkText, {
          x: page.getWidth() / 2 - 75,
          y: page.getHeight() / 2,
          size: 50,
          font: font,
          color: rgb(0.5, 0.5, 0.5), // Light gray color
          opacity: 0.3, // Opacity value (0 = fully transparent, 1 = fully opaque)
          rotate: degrees(-45), // Correct usage of degrees function
        });
      }

      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();

      // Create a Blob and initiate a download
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modified.pdf';
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error adding watermark:', error);
    }
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileChange} accept=".pdf" />
      </div>
    );
  }
}

export default AddWatermark;
