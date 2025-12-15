import {
  reactExtension,
  Text,
  useApi,
  BlockStack,
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
  const [discountCode, setDiscountCode] = useState("");
  let appUrl = process.env.APP_URL;

  useEffect(() => {
    fetch(`${appUrl}/api/thankyou?shop=${shop.myshopifyDomain}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMessage(data?.message);
        if (data?.discountCode !== "") {
          setDiscountCode(data?.discountCode);
        }
      });
  }, [shop?.myshopifyDomain]);

  // 3. Render a UI
  return (
    <BlockStack>
      <Text appearance="success">{message}</Text>
      {discountCode && (
        <Text>
          We appreciate you buying from us. Use code {discountCode} for 10% off
          your next purchase.
        </Text>
      )}
    </BlockStack>
  );
}
