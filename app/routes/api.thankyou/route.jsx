import { json } from "@remix-run/react";
import prisma from "../../db.server";
import { authenticate } from "../../shopify.server";
import withCors from "../../cors";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const settings = await prisma.findUnique({
    where: { shop },
  });

  return json({ message: settings?.message || "Thank you for your purchase!" });
}
