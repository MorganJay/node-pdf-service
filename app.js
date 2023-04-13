const express = require('express');
const bodyParser = require('body-parser');
const data = require('./data.json');

const {
  prepareHtml,
  generatePdfFromHtmlAsync,
  getReceiptFileName,
} = require('./utils');

const app = express();
const port = 3000;

// parse application/json
app.use(bodyParser.json());

app.get('/', (_, res) => res.send('Hello, world'));

app.get('/api/receipt', (_, res) => {
  const html = prepareHtml(data);

  (async () => {
    try {
      const pdf = await generatePdfFromHtmlAsync(html);

      const fileName = getReceiptFileName();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.send(pdf);
    } catch (error) {
      console.log('An error occurred: ', error);
      res.status(400).send({ message: 'An unexpected error occurred' });
    }
  })();
});

app.post('/api/transaction-receipt', (req, res) => {
  const requestBody = req.body;

  const html = prepareHtml(requestBody);

  (async () => {
    try {
      const pdf = await generatePdfFromHtmlAsync(html);

      const fileName = getReceiptFileName();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

      res.send(pdf);
      process.exit();
    } catch (error) {
      console.log('An error occurred: ', error);
      res.status(400).send({ message: 'An unexpected error occurred' });
    }
  })();
});

app.listen(port, () => console.log('app listening on port ' + port));
