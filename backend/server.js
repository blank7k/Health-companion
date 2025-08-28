import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import { mockStaff, mockPatients } from "./mockData.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Setup mail transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sahil.mundhe2005@gmail.com",        // SENDER EMAIL
    pass: "jzjt ioql akbm ytbu"           // GMAIL APP PASSWORD (not normal password)
  }
});

app.post("/send-discharge-email", async (req, res) => {
  
  try {
    const { staffName } = req.body;

    const staff = mockStaff.find(
      s => s.name.toLowerCase() === staffName.toLowerCase()
    );
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    // const today = new Date().toISOString().split("T")[0];
    // const patients = mockPatients.filter(p => p.dischargeDate === ready);
const patients = mockPatients.filter(
      p => p.dischargeStatus?.toLowerCase() === "ready"
    );
    if (!patients.length) {
      return res.json({ message: "No discharges today." });
    }

    // Prepare email content
    const emailHtml = `
      <h2>Discharge Summary</h2>
      <ul>
        ${patients.map(p => `
          <li>
            <strong>${p.name}</strong> (Room: ${p.room}) – ${p.diagnosis}
          </li>
        `).join("")}
      </ul>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Hospital System" <yourgmail@gmail.com>`,   // SAME AS AUTH USER
      to: staff.email,
      subject: "Today's Discharge Summary",
      html: emailHtml
    });

    res.json({
      message: `Discharge email sent to ${staff.name} (${staff.email})`,
      patients
    });
  } catch (err) {
    console.error("Email sending failed:", err);
    res.status(500).json({ message: "Failed to send email", error: err.message });
  }
});



app.listen(5000, () => console.log("Server running on port 5000"));
