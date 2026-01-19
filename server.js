// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://127.0.0.1:27017/dwarakaDB')
//     .then(() => console.log("DB Connected"))
//     .catch(err => console.log(err));

// const Donor = mongoose.model('Donor', new mongoose.Schema({
//     regID: String, name: String, phone: String, amount: String, boxes: String, date: { type: Date, default: Date.now }
// }));

// app.post('/api/register-donor', async (req, res) => {
//     const donor = new Donor(req.body);
//     await donor.save();
//     res.json({ success: true });
// });

// app.listen(5000, () => console.log("Server on 5000"));