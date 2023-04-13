const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const data = require('./data.json');
const path = require('path');

const app = express();
const port = 3000;

// parse application/json
app.use(bodyParser.json());

app.get('/', (_, res) => {
  res.send('Hello, world');
});

app.get('/api/receipt', (_, res) => {
  const html = fs.readFileSync('./receipt.html', 'utf-8');

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

  const puppeteer = require('puppeteer');

  (async () => {
    try {
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
      await browser.close();

      // Set the response headers to indicate that the response is a PDF file
      const fileName = `FCL_Transaction_Receipt_${new Date().getTime()}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

      // Return the PDF in the response
      res.send(pdf);
      console.log('done');
    } catch (error) {
      console.log('An error occurred: ', error);
      res.status(400).send(null);
    }
  })();
});

app.post('/api/transaction-receipt', (req, res) => {
  const requestBody = req.body;
  const html = fs.readFileSync('./receipt.html', 'utf-8');

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
  } = requestBody;

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

  const puppeteer = require('puppeteer');

  (async () => {
    try {
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

      // Set the response headers to indicate that the response is a PDF file
      const fileName = `FCL_Transaction_Receipt_${new Date().getTime()}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

      // Return the PDF in the response
      res.send(pdf);
      process.exit();
    } catch (error) {
      console.log('An error occurred: ', error);
      res.status(400).send(null);
    }
  })();
});

app.listen(port, () => console.log('app listening on port ' + port));
