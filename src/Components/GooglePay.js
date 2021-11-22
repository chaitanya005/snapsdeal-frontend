import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./gpay.css";

const GooglePay = () => {
  const appId = "sandbox-sq0idb--mbjGpbohRlOudysljOUyg";
  const locationId = "LS4DE23DJ0TM9";
  const navigate = useNavigate();
  const [isSucess, setIsSucess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [PaymentDetails, setPaymentDetails] = useState(null);

  async function initializeCard(payments) {
    const card = await payments.card();
    await card.attach("#card-container");

    return card;
  }

  function buildPaymentRequest(payments) {
    return payments.paymentRequest({
      countryCode: "US",
      currencyCode: "USD",
      total: {
        amount: "0.00",
        label: "Total",
      },
    });
  }

  async function initializeGooglePay(payments) {
    const paymentRequest = buildPaymentRequest(payments);
    const googlePay = await payments.googlePay(paymentRequest);
    await googlePay.attach("#google-pay-button");

    return googlePay;
  }

  async function createPayment(token) {
    const body = JSON.stringify({
      locationId,
      sourceId: token,
    });

    const paymentResponse = await fetch(
      "https://snapsdeal-backend.herokuapp.com/payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }
    );

    if (paymentResponse.ok) {
      console.log(paymentResponse);
      // navigate("/success");
      return paymentResponse.json();
    }

    const errorBody = await paymentResponse.text();
    throw new Error(errorBody);
  }

  async function tokenize(paymentMethod) {
    const tokenResult = await paymentMethod.tokenize();
    if (tokenResult.status === "OK") {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
      }

      throw new Error(errorMessage);
    }
  }

  // status is either SUCCESS or FAILURE;
  const displayPaymentResults = (status) => {
    const statusContainer = document.getElementById("payment-status-container");
    if (status === "SUCCESS") {
      console.log(status);
      setIsSucess(true);
      setIsFailure(false);
      statusContainer.classList.remove("is-failure");
      statusContainer.classList.add("is-success");
    } else {
      setIsSucess(false);
      setIsFailure(true);
      statusContainer.classList.remove("is-success");
      statusContainer.classList.add("is-failure");
    }

    statusContainer.style.visibility = "visible";
  };

  useEffect(() => {
    onGooglePayLoad();
  }, []);

  const onGooglePayLoad = async () => {
    if (!window.Square) {
      throw new Error("Square.js failed to load properly");
    }

    let payments;
    try {
      payments = window.Square.payments(appId, locationId);
    } catch {
      const statusContainer = document.getElementById(
        "payment-status-container"
      );
      statusContainer.className = "missing-credentials";
      statusContainer.style.visibility = "visible";
      return;
    }

    let card;
    try {
      card = await initializeCard(payments);
    } catch (e) {
      console.error("Initializing Card failed", e);
      return;
    }

    let googlePay;
    try {
      googlePay = await initializeGooglePay(payments);
    } catch (e) {
      console.error("Initializing Google Pay failed", e);
      // There are a number of reason why Google Pay may not be supported
      // (e.g. Browser Support, Device Support, Account). Therefore you should handle
      // initialization failures, while still loading other applicable payment methods.
    }

    async function handlePaymentMethodSubmission(event, paymentMethod) {
      event.preventDefault();

      try {
        // disable the submit button as we await tokenization and make a payment request.
        cardButton.disabled = true;
        const token = await tokenize(paymentMethod);
        const paymentResults = await createPayment(token);
        displayPaymentResults("SUCCESS");
        setPaymentDetails(paymentResults);
        // console.log(paymentResults.payment.status);
        /* navigate(`/success?status=${paymentResults.payment.status}`, {
          state: { paymentResults },
        });  */
        console.log("Payment Success", paymentResults);
      } catch (e) {
        cardButton.disabled = false;
        displayPaymentResults("FAILURE");
        console.error(e.message);
      }
    }

    const cardButton = document.getElementById("card-button");
    cardButton.addEventListener("click", async function (event) {
      await handlePaymentMethodSubmission(event, card);
    });

    // Checkpoint 2.
    if (googlePay) {
      const googlePayButton = document.getElementById("google-pay-button");
      googlePayButton.addEventListener("click", async function (event) {
        await handlePaymentMethodSubmission(event, googlePay);
      });
    }
  };
  return (
    <Grid>
      {!isSucess && (
        <form id="payment-form">
          <Grid id="google-pay-button"></Grid>
          <Grid id="card-container"></Grid>
          <button id="card-button" type="button">
            Pay $1.00
          </button>
        </form>
      )}
      <Grid id="payment-status-container"></Grid>
      {isSucess && (
        <Button
          onClick={() => {
            navigate("/success");
            localStorage.setItem(
              "paymentDetails",
              JSON.stringify(PaymentDetails)
            );
          }}
          variant="contained"
        >
          Invoice
        </Button>
      )}
      {isFailure && (
        <Button onClick={() => navigate("/")} variant="outlined">
          Home
        </Button>
      )}
    </Grid>
  );
};

export default GooglePay;
