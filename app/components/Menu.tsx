import React from 'react';
import { auth } from "@/auth";
import MenuItems from './MenuItems';

const Menu = async () => {
    let menuItems: NavigationItem[] = [];
    const session = await auth();

    if (session?.user) {
        const { user } = await auth() as { user: { id: string, role: string } };
        if (user.role === 'ADMIN') {
            menuItems = [
                { name: 'All Products', href: '/products' },
                { name: 'All Vendors', href: '/vendors' },
            ];
        } else {
            menuItems = [
                { name: 'My Products', href: '/products' },
            ];
        }
        menuItems.push({ name: 'Add New Machine', href: '/products/new' });
    }

    return (
        <MenuItems navigation={menuItems as NavigationItem[]} />
    )
}

export default Menu