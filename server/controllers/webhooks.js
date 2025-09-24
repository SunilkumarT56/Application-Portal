import { Webhook } from "svix";
import User from "../models/User.js";

const webhook_secret = process.env.CLERK_WEBHOOK_SECRET;

export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(webhook_secret);
    let evt = await wh.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = evt;

    switch (type) {
      // 🔹 When a new user is created
      case "user.created": {
        const userData = {
          _id: data.id, // Clerk's user ID
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses[0].email_address,
          resume: "", // default empty (you can update later)
          image: data.image_url,
        };
        await User.create(userData);
        res.json({});
        console.log("✅ User created:", userData);
        break;
      }

      // 🔹 When a user is updated (name, email, image, etc.)
      case "user.updated": {
        await User.findByIdAndUpdate(
          data.id,
          {
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            email: data.email_addresses[0].email_address,
            image: data.image_url,
          },
          { new: true }
        );
        res.json({});
        console.log("✅ User updated:", data.id);
        break;
      }

      // 🔹 When a user is deleted
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        console.log("✅ User deleted:", data.id);
        break;
      }

      default:
        console.log("Unhandled event type:", type);
    }
  } catch (err) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};
