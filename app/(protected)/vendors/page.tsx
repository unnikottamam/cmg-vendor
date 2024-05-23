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
import { FaRegEdit } from "react-icons/fa";
import AssignVendor from './_components/AssignVendor';
import { getUnassignedProducts } from '@/actions/products';

const Vendors = async () => {
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
    const products = await getUnassignedProducts();

    return (
        <>
            <div className="flex justify-between items-center mb-3">
                <h1 className="text-xl font-semibold text-slate-600">All Vendors</h1>
                <div className="flex gap-2">
                    {(vendors.length && products.length) ? <AssignVendor vendors={vendors} products={products} /> : ''}
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
                        <TableHead className="w-24">Products</TableHead>
                        <TableHead className="w-32"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vendors.length ? vendors.map((user) => {
                        const fullName = `${user.firstName} ${user.lastName}`;
                        const { email, phone, company } = user;
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
                                <TableCell>
                                    <Link href={`/vendors/${user.id}`}>
                                        <Button size="sm" variant="default">
                                            <FaRegEdit />
                                            Manage
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        );
                    }) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">No vendors to show</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

export default Vendors