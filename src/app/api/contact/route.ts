import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const name = formData.get('name')
    const message = formData.get('message')
    const auditionFile = formData.get('audition')

    if (typeof name !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 })
    }

    const attachments = []

    // ✅ Only process file if it's a File and not empty
    if (auditionFile instanceof File && auditionFile.size > 0) {
      const fileBuffer = Buffer.from(await auditionFile.arrayBuffer())
      attachments.push({
        filename: auditionFile.name,
        content: fileBuffer,
        contentType: auditionFile.type,
      })
    }

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    })

    // Mail options
    const mailOptions = {
      from: `"Audition Submission" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Audition from ${name}`,
      text: `${name} says:\n\n${message}`,
      ...(attachments.length > 0 && { attachments }),
    }

    // Respond immediately while email sends in background
    const response = NextResponse.json({ success: true, message: 'Audition is being sent' })

    transporter.sendMail(mailOptions).catch(err => {
      console.error('Failed to send email:', err)
    })

    return response
  } catch (error) {
    console.error('Error processing audition:', error)
    return NextResponse.json({ error: 'Failed to process audition' }, { status: 500 })
  }
}
