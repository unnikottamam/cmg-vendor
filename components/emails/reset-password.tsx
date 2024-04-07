import React from 'react';

interface ResetPasswordProps {
    resetLink: string;
    resetStatus: boolean;
}

const ResetPassword = ({ resetLink, resetStatus }: ResetPasswordProps) => {
    return (
        <div>
            {!resetStatus ? <p>Click <a href={resetLink}>here</a> to reset your password, token will expire in 1 hour.</p> : <p>Your password has been reset successfully, please <a href={resetLink}>login</a> with your new password</p>}
        </div>
    )
};

export default ResetPassword;