import { json, useLoaderData } from "@remix-run/react";
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
  let appUrl = process.env.APP_URL;

  useEffect(() => {
    fetch(`${appUrl}/api/thankyou?shop=${shop.myshopifyDomain}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("DATA-----", data);

        setMessage(data);
      });
  }, [shop?.myshopifyDomain]);

  // 3. Render a UI
  return <Text appearance="success">{message?.message}</Text>;
}
