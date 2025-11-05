import { json } from "@remix-run/react";
import {
  reactExtension,
  Text,
  useApi,
  useShop,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <ThankYouExtension />
));

function ThankYouExtension() {
  const { shop } = useApi();
  const [message, setMessage] = useState("");

  console.log("SHOP--------", shop);

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await fetch(
        `https://titten-federation-ultram-carolina.trycloudflare.com/api/thankyou?shop=${shop.myshopifyDomain}`,
      );

      console.log("RESPONSE-------", response.json());
      return response.json();
    };

    fetchMessage();
  }, [shop]);

  console.log("MESSAGE-----", message);
  // 3. Render a UI
  return <Text appearance="success">{message}</Text>;
}
