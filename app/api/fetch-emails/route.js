import { NextResponse } from "next/server";

import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth"; //check auth

import { google } from "googleapis";

export async function GET(request) {
  try {
    
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    //console.log("iam here");
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: session.accessToken,
    });


    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      q: "in:sent",
    });

    const messages = response.data.messages || [];


    if (messages.length === 0) {
      return NextResponse.json(
        { 
          error: "No sent emails found",
          message: "It looks like you haven't sent any emails yet. Please send a few emails first and try again."
        },
        { status: 404 }
      );
    }

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

    // no content
    if (filteredEmails.length === 0) {
      return NextResponse.json(
        { 
          error: "No email content found",
          message: "Your sent emails don't contain enough text content for analysis. Please send some emails with text and try again."
        },
        { status: 404 }
      );
    }

    //console.log( JSON.stringify(filteredEmails));

    return NextResponse.json({ emails: filteredEmails });

  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}