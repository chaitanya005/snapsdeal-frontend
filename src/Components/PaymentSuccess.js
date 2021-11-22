import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentSuccess = (props) => {
  const [paymentDetails, setPaymentDetails] = useState();
  const [orderDetails, setOrderDetails] = useState();
  useEffect(() => {
    const paymentDetails = localStorage.getItem("paymentDetails");
    console.log(JSON.parse(paymentDetails).payment);
    getOrderDetails(JSON.parse(paymentDetails).payment.orderId);
    setPaymentDetails(JSON.parse(paymentDetails).payment);
  }, []);

  const getOrderDetails = async (orderId) => {
    console.log(orderId);
    const { data } = await axios.post("http://localhost:8000/order-details", {
      orderId,
    });
    console.log(data);
    setOrderDetails(data.order);
  };

  /*  useEffect(() => {
    getOrderDetails();
  }, []); */

  return (
    <Grid>
      <Grid>
        <Typography
          style={{
            background: "#4AA05F",
            color: "#fff",
            padding: "10px",
            // borderRadius: "5%",
            textTransform: "uppercase",
          }}
        >
          Payment Success
        </Typography>
      </Grid>
      <Grid style={{ display: "flex", justifyContent: "space-between" }}>
        <Grid>
          <Typography variant="body2">
            Payment Id: {paymentDetails && paymentDetails.id}
          </Typography>
          <Typography variant="body2">
            Order Id: {paymentDetails && paymentDetails.orderId}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body2">
            Total Amount: {paymentDetails && paymentDetails.amountMoney.amount}{" "}
            {paymentDetails && paymentDetails.amountMoney.currency}
          </Typography>
          <Typography variant="body2">
            Payment Method: {paymentDetails && paymentDetails.sourceType}
          </Typography>
        </Grid>
      </Grid>
      <Grid>
        {orderDetails &&
          orderDetails.lineItems.map((item) => (
            <Grid>
              <Typography>
                Name: {item.name} x{item.quantity}
              </Typography>
              <Typography>
                Price: {item.basePriceMoney.amount}{" "}
                {item.basePriceMoney.currency}{" "}
              </Typography>
            </Grid>
          ))}
      </Grid>
    </Grid>
  );
};

export default PaymentSuccess;
