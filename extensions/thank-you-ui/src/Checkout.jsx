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
    fetch(`api/thankyou?shop=${shop.myshopifyDomain}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMessage(data?.message);
      });
  }, [shop?.myshopifyDomain]);

  // 3. Render a UI
  return <Text appearance="success">{message}</Text>;
}
