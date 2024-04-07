import React from 'react';

interface UserRegistrationProps {
    user: UserBasicInfo;
}

const UserRegistration = ({ user }: UserRegistrationProps) => {
    return (
        <div>
            <h4>New User Registration</h4>
            <p>{user.firstName} {user.lastName} has registered with the following details:</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            {user.company && <p>Company: {user.company}</p>}
            <p>Address: {user.streetAddress}, {user.city}, {user.state}, {user.zip}, {user.country}</p>
        </div>
    )
};

export default UserRegistration;