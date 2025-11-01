import {
  reactExtension,
  Text,
  useSettings,
} from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.block.render", () => (
  <ThankYouMessage />
));

function ThankYouMessage() {
  const { message } = useSettings();
  return (
    <Text appearance="success">
      {message || "Thank you for your purchase! Asswipe 🎉"}
    </Text>
  );
}
