/* global window */

import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  TextField,
  Button,
  Toast,
  Frame,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useCallback, useEffect, useState } from "react";
import { useActionData, Form } from "@remix-run/react";

import prisma from "../db.server";

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const message = formData.get("message");
  const discountCode = formData.get("discountCode");

  await prisma.ThankYouSettings.upsert({
    where: { shop },
    update: { message, discountCode },
    create: { shop, message, discountCode },
  });

  return { success: true };
}

export default function AdditionalPage() {
  const actionData = useActionData();
  const [message, setMessage] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [activeToast, setActiveToast] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [discountCodeError, setDiscountCodeError] = useState("");

  const toggleActiveToast = useCallback(
    () => setActiveToast((activeToast) => !activeToast),
    [],
  );

  const handleMessageChange = useCallback((value) => setMessage(value), []);
  const handleDiscountCodeChange = useCallback(
    (value) => setDiscountCode(value),
    [],
  );

  const toastMarkup =
    activeToast && actionData?.success ? (
      <Toast content="Settings saved!" onDismiss={toggleActiveToast} />
    ) : null;

  useEffect(() => {
    if (actionData?.success) {
      setMessage("");
      setDiscountCode("");
    }
  }, [actionData]);

  const handleFormSubmit = (event) => {
    console.log("Initial commit");

    let hasError = false;
    if (!message.trim()) {
      setMessageError("This field cannot be empty!");
      hasError = true;
    } else {
      setMessageError("");
    }

    if (!discountCode.trim()) {
      setDiscountCodeError("This field cannot be empty!");
      hasError(true);
    } else {
      setDiscountCodeError("");
    }

    if (hasError) {
      event.preventDefault();
    }
  };

  return (
    <Frame>
      <Page title="Custom Thank you page">
        <ui-title-bar title="Custom Thank you page"></ui-title-bar>
        <Card>
          <Form method="POST" onSubmit={handleFormSubmit}>
            <BlockStack gap="500">
              <Text as="h2">
                Add a personalized message, image, or discount for your
                customers after checkout.
              </Text>
              <TextField
                onChange={handleMessageChange}
                name="message"
                label="Message to display"
                value={message}
                error={messageError}
              />
              <TextField
                onChange={handleDiscountCodeChange}
                name="discountCode"
                label="Discount Code"
                value={discountCode}
                error={discountCodeError}
              />
              <BlockStack gap="100">
                <Text>Thank you for your order!</Text>
                <Text>
                  We appreciate you buying from us. Use code WELCOME10 for 10%
                  off your next purchase.
                </Text>
              </BlockStack>
              <Button onClick={toggleActiveToast} submit variant="primary">
                Save
              </Button>
            </BlockStack>
          </Form>
        </Card>
        {toastMarkup}
      </Page>
    </Frame>
  );
}
