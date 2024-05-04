import { Font, Html, Preview, Body, Container, Text, Tailwind, Link, Section } from "@react-email/components";
import React from 'react';

interface VerifyEmailProps {
    verifyLink: string;
    firstName: string;
}

const VerifyEmail = ({ verifyLink, firstName }: VerifyEmailProps) => {
    return (
        <Html>
            <Font
                fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                    url: "https://fonts.googleapis.com/css2?family=Ubuntu+Sans&display=swap",
                    format: "woff2"
                }}
                fontWeight={400}
                fontStyle="normal"
            />
            <Preview>Verify your email</Preview>
            <Tailwind>
                <Body className="bg-white">
                    <Container>
                        <Text className="text-lg mb-0 font-bold">Hi {firstName},</Text>
                        <Text className="text-sm mt-0">
                            Thank you for signing up with <strong>Coast Machinery Group.</strong>
                        </Text>
                        <Section className="border border-solid border-slate-600 p-4 rounded-md">
                            <Text className="text-sm mt-0">
                                Please verify your email address by clicking the link below.
                            </Text>
                            <Link className="bg-sky-700 text-white px-4 py-2 rounded-md text-sm" href={verifyLink}>
                                Verify Email
                            </Link>
                            <Text className="text-sm mb-0 break-words">
                                If you have difficulties verifying your email, copy and paste the following URL into your browser:
                                {verifyLink}
                            </Text>
                        </Section>
                        <Text className="text-sm mt-4 mb-0 text-center">
                            Coast Machinery Group
                        </Text>
                        <Text className="text-xs text-center mt-0">
                            31789 King Rd #170, Abbotsford, BC V2T 5Z2
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default VerifyEmail