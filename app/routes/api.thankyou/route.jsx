import { json } from "@remix-run/react";
import prisma from "../../db.server";
import withCors from "../../cors";

export async function loader({ request }) {
  try {
    //Extract shop name from query params
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    if (!shop) {
      return withCors(
        { error: "Missing 'shop' query parameter." },
        { status: 400 },
      );
    }

    //Fetch your saved message for that shop
    const settings = await prisma.ThankYouSettings.findUnique({
      where: { shop: shop },
    });

    //Create the response
    const response = json({
      message: settings?.message || "Thank you for your purchase!",
    });

    //Enable CORS so it can be fetched from storefronts or extensions

    return withCors(response);
  } catch (error) {
    console.error("Error in /api/thankyou route", error);
    return withCors(json({ error: "Internal server error" }, { status: 500 }));
  }
}
