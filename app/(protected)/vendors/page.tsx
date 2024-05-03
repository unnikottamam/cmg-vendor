import { auth } from '@/auth';
import prisma from '@/prisma/client';
import Link from 'next/link'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { FiUserPlus } from "react-icons/fi";
import axios from 'axios';
import AssignVendor from './_components/AssignVendor';

const Vendors = async () => {
    const { user } = await auth() as { user: { id: string, role: string } };
    const vendors = await prisma.user.findMany({
        where: { role: 'EDITOR' }
    });

    const numOfProducts: { [key: number]: number } = {};
    const numProdPrmoises = vendors.map(async vendor => {
        numOfProducts[vendor.id] = await prisma.product.count({
            where: { authorId: vendor.id }
        });
    });
    await Promise.all(numProdPrmoises);

    let products: ProductAssign[] = [];
    const internalProducts = await prisma.product.findMany({
        orderBy: { id: "desc" }
    });
    const response = await axios.get(
        `${process.env.WOO_URL}/wp-json/wc/v3/products`,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            auth: {
                username: process.env.WOO_CONSUMER_KEY as string,
                password: process.env.WOO_SECRET_KEY as string,
            },
            params: {
                'exclude': internalProducts.map(product => product.wooId).join(','),
                'per_page': 100
            }
        }
    );
    if (response.data.length) {
        response.data.forEach((product: { id: string; name: string; sku: string; categories: { id: string, name: string, slug: string }[]; }) => {
            const category = product.categories[0].name;
            const { id, name, sku } = product;
            products.push({ id, name, category, sku });
        });
    }

    return (
        <>
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-xl font-semibold text-slate-600">All Vendors</h1>
                <div className="flex gap-2">
                    <AssignVendor vendors={vendors} products={products} />
                    <Link href="/vendors/new">
                        <Button size="sm" variant="success">
                            <FiUserPlus />
                            New Vendor
                        </Button>
                    </Link>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Product Count</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vendors.length ? vendors.map((user) => {
                        const fullName = `${user.firstName} ${user.lastName}`;
                        const { id, email, phone, company } = user;
                        const address = `${user.streetAddress}, ${user.city}, ${user.state}, ${user.zip}, ${user.country}`;
                        return (
                            <TableRow key={user.id}>
                                <TableCell>{fullName}</TableCell>
                                <TableCell>{email}</TableCell>
                                <TableCell>{phone}</TableCell>
                                <TableCell>{company || 'N/A'}</TableCell>
                                <TableCell>{address}</TableCell>
                                <TableCell className="text-center">
                                    {numOfProducts[user.id] || 0}
                                </TableCell>
                            </TableRow>
                        );
                    }) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">No vendors to show</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

export default Vendors