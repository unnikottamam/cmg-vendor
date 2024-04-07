import React from 'react';

interface VerifyEmailProps {
    verifyLink: string;
}

const VerifyEmail = ({ verifyLink }: VerifyEmailProps) => {
    return (
        <div>
            <p>Click <a href={verifyLink}>here</a> to verify your email</p>
        </div>
    )
};

export default VerifyEmail;