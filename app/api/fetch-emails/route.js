import { NextResponse } from "next/server";

import { getServerSession } from "next-auth"; //check auth

import { google } from "googleapis";

export async function GET(request) {
  try {
    
    const session = await getServerSession();

    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });


    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 40,
      q: "in:sent",
    });

    const messages = response.data.messages || [];

    const emails = await Promise.all(

      messages.map(async (message) => {

        const email = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });


        let body = "";
        if (email.data.payload.body.data) {
            
            // decode it to normal text 
            body = Buffer.from(email.data.payload.body.data, "base64").toString();

        }
        return body; 

      })
    );

    const filteredEmails = emails.filter(email => email.trim() !== "");

    
    return NextResponse.json({ emails: filteredEmails });

  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}