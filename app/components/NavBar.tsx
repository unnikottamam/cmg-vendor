"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Disclosure } from '@headlessui/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/logout';

interface NavigationItem {
    name: string;
    href: string;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const NavBar = () => {
    const { status, data: session } = useSession();

    let navigation: NavigationItem[] = [];
    if (status === "loading") {
    } else if (status === "authenticated") {
        const role = session!.user!.role;
        const roles: { [key: string]: NavigationItem[] } = {
            'EDITOR': [{ name: 'My Listing', href: '/products' }],
            'ADMIN': [{ name: 'All Listing', href: '/products' }]
        };
        if (role in roles) {
            navigation = roles[role];
            navigation.push({ name: 'Add New Product', href: '/products/new' });
        }
    }

    const pathname = usePathname();
    const logOutButton = <Button className="bg-red-200 text-slate-900 hover:bg-red-700 hover:text-white" size="sm" onClick={() => logout()}>
        Logout
    </Button>;
    return (
        <Disclosure as="nav" className="border-b shadow-lg shadow-stone-200 bg-gray-100">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {navigation.length ? <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-700 hover:text-white focus:outline-none">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? "CLOSE" : "MENU"}
                                </Disclosure.Button> : ''}
                            </div>
                            <div className={`flex flex-1 items-center justify-center sm:items-stretch ${navigation.length ? "sm:justify-start" : ""}`}>
                                <div className={`flex flex-shrink-0 items-center ${!navigation.length ? " gap-4" : ""}`}>
                                    <Image priority={true} className="rounded-md" src="/coast-machinery.png" alt="CMG" width={82} height={36} />
                                    {!navigation.length ? <p className="text-sm font-bold leading-none">Vendor<br />Dashboard</p> : ""}
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-2">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={classNames(
                                                    item.href === pathname ? 'bg-blue-900 text-white' : 'text-gray-900 hover:bg-blue-200',
                                                    'rounded-md px-3 py-2 text-sm font-medium'
                                                )}
                                                aria-current={item.href === pathname ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {status === "authenticated" && logOutButton}
                            </div>
                        </div>
                    </div>
                    {navigation.length ? <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className={classNames(
                                        item.href === pathname ? 'bg-blue-900 text-white' : 'text-gray-900 hover:bg-blue-200',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                    aria-current={item.href === pathname ? 'page' : undefined}
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}
                        </div>
                    </Disclosure.Panel> : ''}
                </>
            )}
        </Disclosure>
    )
}

export default NavBar