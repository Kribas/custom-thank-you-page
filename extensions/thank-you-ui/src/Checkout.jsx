import { json } from "@remix-run/react";
import {
  reactExtension,
  Text,
  useApi,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <ThankYouExtension />
));

function ThankYouExtension() {
  const { shop, extension } = useApi();
  const extensionTarget = extension.target;
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch(`/apps/api/thankyou-message?shop=${shop.name}`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Erroorr"));
  }, []);

  console.log("SHOP-----", shop);

  // 3. Render a UI
  return <Text appearance="success">{message}</Text>;
}
