const express = require("express");
const cors = require('cors');

const app = express();

const suricataRoutes = require("./routes/suricata");

const corsOptions = {
  origin: '*', // Temporarily
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/suricata", suricataRoutes);

// Production - error handling middleware
/*
app.use((err, req, res, next) => {
  console.error(err); // Log the error details

  // Set a default error message and status code
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Send response
  res.status(statusCode).json({
    status: 'error',
    message,
  });
});
*/

app.listen(4000, "0.0.0.0",() => {console.log(`API Gateway running on port 4000`)});
