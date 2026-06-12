import { prisma } from "@/lib/db";
import ContactClient from "./ContactClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Us - Future Ready Youth",
  description: "Get in touch with the Future Ready Youth team. Reach out via email, phone, or visit our central offices.",
};

export default async function ContactPage() {
  const content = await prisma.content.findMany({
    where: {
      key: {
        in: ["contact_email", "contact_phone", "contact_address"]
      }
    }
  });
  const email = content.find(c => c.key === "contact_email")?.value || "futurereadyyouth6@gmail.com";
  const phone = content.find(c => c.key === "contact_phone")?.value || "";
  const address = content.find(c => c.key === "contact_address")?.value || "";

  return <ContactClient email={email} phone={phone} address={address} />;
}
