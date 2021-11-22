import React, { useEffect, useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Typography, Grid, Paper, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { getUserInfo } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  addToCart,
  selectCartItems,
  updateCart,
  removeItem,
} from "../features/cartSlice";
import { useNavigate } from "react-router";

const BarCodeScanner = () => {
  const [barCodeData, setBarCodeData] = useState("9788122200201");
  const [isScanning, setIsScanning] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  const userInfo = useSelector(getUserInfo);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  const handleApi = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/items");
      if (data) {
        // console.log(data.items);
        if (!itemsData.includes(barCodeData)) {
          let filterdItems = data.items.filter((item) => {
            return Object.values(item.customAttributeValues)[0].stringValue;
          });

          setItemsData((prev) => [...prev, filterdItems]);

          filterdItems.map((item) => {
            const getFormmatedData = {
              id: item.id,
              name: item.itemData.name,
              amount:
                item.itemData.variations[0].itemVariationData.priceMoney.amount,
              currency:
                item.itemData.variations[0].itemVariationData.priceMoney
                  .currency,
              qty: qty,
            };
            const bool = cartItems.filter((item1) => item1.id === item.id);
            if (!bool) {
              dispatch(addToCart(getFormmatedData));
            } else if (cartItems.length === 0) {
              dispatch(addToCart(getFormmatedData));
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleApi();
  }, []);

  let total = 0;

  cartItems.map((item) => {
    total += (item.amount / 100) * item.qty;
  });

  const handlePlaceOrder = async () => {
    const cartItemsData = { cartItems, total, name: userInfo["name"] };
    const { data } = await axios.post("http://localhost:8000/create-order", {
      cartItemsData,
    });
    navigate("/gpay");
    console.log(data);
  };

  return (
    <div>
      <Grid item xs={12} style={{ margin: "5px" }}>
        <Typography variant="h4">Hello, {userInfo.name}</Typography>
      </Grid>
      {!isScanning && (
        <Button
          variant="contained"
          style={{ alignItems: "center", margin: "16px 0" }}
          onClick={() => setIsScanning(true)}
          startIcon={<AddAPhotoIcon />}
        >
          Scan BarCode
        </Button>
      )}
      {isScanning ? (
        <React.Fragment>
          <BarcodeScannerComponent
            width={400}
            height={250}
            onUpdate={(err, result) => {
              if (result) {
                setBarCodeData(result.text);
                setIsScanning(false);
              } else setBarCodeData("Scan BarCode");
            }}
          />
          <p>{barCodeData}</p>
        </React.Fragment>
      ) : (
        ""
      )}
      <Grid>
        <Grid item style={{ backgroundColor: "pink" }}>
          <Typography variant="h4" style={{ padding: "15px" }}>
            Shopping Cart
          </Typography>
        </Grid>
        <Grid>
          {cartItems &&
            cartItems.map((item) => <DataItems item={item} key={item.id} />)}
        </Grid>
      </Grid>
      <Grid
        style={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          paddingBottom: "10px",
        }}
      >
        <br />
        <Grid style={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="h5">Total: {total}</Typography>
          <Grid item xs={1}></Grid>
          <Button
            variant="contained"
            style={{ marginRight: "25px" }}
            endIcon={<ArrowRightAltIcon />}
            onClick={() => handlePlaceOrder()}
          >
            Place Order
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

const DataItems = ({ item }) => {
  const [qty, setQty] = useState(1);

  const dispatch = useDispatch();

  const getFormmatedData = {
    id: item.id,
    name: item.name,
    amount: item.amount,
    currency: item.currency,
    qty: qty,
  };

  useEffect(() => {
    dispatch(updateCart(getFormmatedData));
  }, [qty]);

  return (
    <Paper
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      key={item.id}
    >
      <Typography
        fontSize={22}
        style={{ margin: "15px", width: "500px", fontSize: "1.3rem" }}
      >
        {item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name}
      </Typography>
      <Grid item xs={4}></Grid>
      <Grid item style={{ display: "flex", alignItems: "center" }}>
        <RemoveIcon
          onClick={() => {
            if (qty > 1) {
              setQty((prev) => prev - 1);
            }
          }}
          style={{ borderRadius: "50%", border: "3px solid #eee" }}
        />
        <Typography style={{ margin: "0 8px" }}>{qty}</Typography>
        <AddIcon
          onClick={() => setQty((prev) => prev + 1)}
          style={{ borderRadius: "50%", border: "3px solid #eee" }}
        />
      </Grid>
      <Typography variant="body1" style={{ margin: "15px" }}>
        {(item.amount / 100) * qty} {item.currency}
      </Typography>
      <DeleteIcon
        style={{ margin: "15px" }}
        onClick={() => {
          dispatch(removeItem(item.id));
        }}
      />
    </Paper>
  );
};

export default BarCodeScanner;
