"use server"

import { Resend } from "resend"

const resend =new Resend(process.env.RESEND_API_KEY)

export const sendEmail=  async()=>{
    await resend.emails.send({
        to: process.env.EMAIL_TO ?? "",
        from: "rv <onboarding@resend.dev>",
        subject: "Contact Form Submission",
        text: "Contact Form Submission",
    })
}