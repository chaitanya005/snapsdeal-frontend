import { Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { removeCartItems } from "../features/cartSlice";
import { useDispatch } from "react-redux";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const PaymentSuccess = (props) => {
  const [paymentDetails, setPaymentDetails] = useState();
  const [orderDetails, setOrderDetails] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    const paymentDetails = localStorage.getItem("paymentDetails");
    console.log(JSON.parse(paymentDetails).payment);
    getOrderDetails(JSON.parse(paymentDetails).payment.orderId);
    setPaymentDetails(JSON.parse(paymentDetails).payment);
    dispatch(removeCartItems());
  }, []);

  const getOrderDetails = async (orderId) => {
    console.log(orderId);
    const { data } = await axios.post(
      "https://snapsdeal-backend.herokuapp.com/order-details",
      {
        orderId,
      }
    );
    console.log(data);
    setOrderDetails(data.order);
  };

  /*  useEffect(() => {
    getOrderDetails();
  }, []); */

  return (
    <Grid>
      <Grid
        style={{
          justifyContent: "center",
          alignContent: "center",
          display: "grid",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box>
          <Card variant="outlined" style={{ background: "#f5f3f4" }}>
            <CardContent>
              <Grid>
                <Button
                  style={{
                    background: "#4AA05F",
                    color: "#fff",
                    padding: "10px",
                    textTransform: "uppercase",
                    fontSize: "0.9rem",
                  }}
                  endIcon={
                    <CheckCircleIcon
                      style={{ background: "#4AA05F", color: "#fff" }}
                    />
                  }
                >
                  Payment Success
                </Button>
              </Grid>

              <Grid
                mt={3}
                // style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Grid>
                  <Typography
                    variant="body1"
                    style={{ color: "black", textAlign: "center" }}
                  >
                    Payment Id: {paymentDetails && paymentDetails.id}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ color: "black", textAlign: "center" }}
                  >
                    Order Id: {paymentDetails && paymentDetails.orderId}
                  </Typography>
                </Grid>

                <Grid mt={5}>
                  <Typography variant="h5">ITEMS</Typography>
                </Grid>
                {orderDetails &&
                  orderDetails.lineItems.map((item) => (
                    <Grid>
                      <Grid
                        mt={1}
                        style={{
                          background: "#0582ca",
                          padding: "10px",
                          borderRadius: "9px",
                        }}
                      >
                        <Typography
                          style={{ color: "#fff", textAlign: "center" }}
                        >
                          Name: {item.name} x{item.quantity}
                        </Typography>
                        <Typography
                          style={{ color: "#fff", textAlign: "center" }}
                        >
                          Price: {item.basePriceMoney.amount}{" "}
                          {item.basePriceMoney.currency}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                <Grid mt={3}>
                  <Typography
                    variant="body1"
                    style={{ color: "black", textAlign: "center" }}
                  >
                    Total Amount:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontStyle: "bold",
                        fontWeight: "600",
                      }}
                    >
                      {paymentDetails && paymentDetails.amountMoney.amount}{" "}
                      {paymentDetails && paymentDetails.amountMoney.currency}
                    </span>
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ color: "black", textAlign: "center" }}
                  >
                    Payment Method:{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        fontStyle: "bold",
                        fontWeight: "600",
                      }}
                    >
                      {paymentDetails && paymentDetails.sourceType}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
};

export default PaymentSuccess;
