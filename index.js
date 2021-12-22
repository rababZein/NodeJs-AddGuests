const express = require('express');
const amqp = require('amqplib/callback_api');
const app = express();
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// This responds a POST request for the homepage
app.post('/addGuest', function (req, res) {
    // console.log(req.body.name);
    amqp.connect('amqps://sefbsgbu:F84ZXipYzfADFygHss5_L-Bass0ZTsfk@jellyfish.rmq.cloudamqp.com/sefbsgbu',
    function(error, connection) {
        if (error) {
            throw error;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            let queue = 'User-messages';
            let msg = {
                "email" : req.body.email,
                "name" : req.body.name,
                "phone": req.body.phone
            };

            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
                persistent: true
            });
            res.send('Data is Queued To be inserted in DataBase');
            console.log("Sent '%s'", msg);
        });
        // setTimeout(function() {
        //     connection.close();
        //     process.exit(0)
        // }, 500);
    });
 });