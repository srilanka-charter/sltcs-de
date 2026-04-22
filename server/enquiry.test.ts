import { describe, expect, it } from "vitest";
import nodemailer from "nodemailer";

describe("Gmail SMTP environment", () => {
  it("GMAIL_USER should be set and contain @", () => {
    const user = process.env.GMAIL_USER;
    expect(user).toBeDefined();
    expect(user).toContain("@");
  });

  it("GMAIL_APP_PASSWORD should be set and non-empty", () => {
    const pass = process.env.GMAIL_APP_PASSWORD;
    expect(pass).toBeDefined();
    expect(pass!.length).toBeGreaterThan(0);
  });

  it("nodemailer transporter can be created with Gmail credentials", () => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER ?? "",
        pass: process.env.GMAIL_APP_PASSWORD ?? "",
      },
    });
    expect(transporter).toBeDefined();
  });
});
