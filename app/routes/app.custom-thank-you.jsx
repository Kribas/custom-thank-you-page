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
import { useActionData, Form, json } from "@remix-run/react";

import prisma from "../db.server";

export async function action({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;
  const formData = await request.formData();
  const message = formData.get("message");
  const discountCode = formData.get("discountCode");

  try {
    let settings = await prisma.ThankYouSettings.upsert({
      where: { shop },
      update: { message, discountCode },
      create: { shop, message, discountCode },
    });
    return { success: true, settings: settings };
  } catch (error) {
    console.error("Error saving Thank You settings:", error);
    return { success: false, error: "Failed to save Thank You settings" };
  }
}

export default function AdditionalPage() {
  const actionData = useActionData();
  const [message, setMessage] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [activeToast, setActiveToast] = useState(false);
  const [messageError, setMessageError] = useState("");

  const toggleActiveToast = useCallback(
    () => setActiveToast((activeToast) => !activeToast),
    [],
  );

  const handleMessageChange = useCallback((value) => {
    setMessage(value);
    if (value.trim()) {
      setMessageError("");
    }
  }, []);
  const handleDiscountCodeChange = useCallback((value) => {
    setDiscountCode(value);
  }, []);

  const toastMarkup =
    activeToast && actionData?.success ? (
      <Toast content="Settings saved!" onDismiss={toggleActiveToast} />
    ) : null;

  useEffect(() => {
    if (actionData?.success) {
      setMessage("");
      setDiscountCode("");
      setActiveToast(true);
    }
  }, [actionData]);

  const handleFormSubmit = (event) => {
    let hasError = false;
    if (!message.trim()) {
      setMessageError("This field cannot be empty!");
      hasError = true;
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
                label="Discount Code Display(Optional)"
                value={discountCode}
              />
              <Button submit variant="primary">
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
