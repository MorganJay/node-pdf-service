const fs = require('fs');
const puppeteer = require('puppeteer');

const prepareHtml = data => {
  const {
    amount,
    beneficiaryName,
    beneficiaryAccount,
    senderAccount,
    senderName,
    date,
    time,
    transType,
    status,
    reference,
    description,
    fee,
  } = data;

  const html = fs.readFileSync('./receipt.html', 'utf-8');

  const htmlReadyToRender = html
    .replace('{{amount}}', amount)
    .replace('{{beneficiaryName}}', beneficiaryName)
    .replace('{{beneficiaryAccount}}', beneficiaryAccount)
    .replace('{{senderName}}', senderName)
    .replace('{{senderAccount}}', senderAccount)
    .replace('{{transDate}}', date)
    .replace('{{transTime}}', time)
    .replace('{{description}}', description)
    .replace('{{fee}}', fee)
    .replace('{{reference}}', reference)
    .replace('{{transType}}', transType)
    .replace('{{status}}', status);

  return htmlReadyToRender;
};

const generatePdfFromHtmlAsync = async htmlReadyToRender => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlReadyToRender);
  await page.emulateMediaType('screen');

  const pdf = await page.pdf({
    printBackground: true,
    scale: 1,
    format: 'A4',
    margin: { top: '130px' },
  });

  console.log('done');
  await browser.close();
  return pdf;
};

const getReceiptFileName = () =>
  `FCL_Transaction_Receipt_${new Date().getTime()}.pdf`;

module.exports = { getReceiptFileName, generatePdfFromHtmlAsync, prepareHtml };
