import { getProductByUserId, getUnassignedProducts } from '@/actions/products';
import { getVendorById } from '@/actions/vendor';
import { User } from '@prisma/client';
import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import { IoImageOutline } from "react-icons/io5";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaRegUser } from "react-icons/fa";
import { FiPhone, FiMapPin } from "react-icons/fi";
import { BsEnvelope } from "react-icons/bs";
import { IoMdEye } from "react-icons/io";
import AssignVendor from '../_components/AssignVendor';

const VendorDetails = async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const vendor = await getVendorById(Number(id)) as User;
    if (!vendor) {
        return <div>Vendor not found</div>
    }

    const vendorProducts = await getProductByUserId(Number(id));
    const products = await getUnassignedProducts();
    return (
        <>
            <Card className="shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                        Vendor Information
                        <AssignVendor products={products} userId={vendor.id} userName={`${vendor.firstName} ${vendor.lastName}`} />
                    </CardTitle>
                    <hr />
                </CardHeader>
                <CardContent>
                    <p className="font-semibold flex items-center gap-2">
                        <FaRegUser />
                        {vendor.firstName} {vendor.lastName}
                        {vendor.company ? ` | ${vendor.company}` : ''}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                        <BsEnvelope />
                        {vendor.email}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                        <FiPhone />
                        {vendor.phone}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                        <FiMapPin />
                        {vendor.streetAddress}, {vendor.city}, {vendor.state}, {vendor.zip}, {vendor.country}
                    </p>
                </CardContent>
            </Card>
            <h2 className="text-lg font-semibold mt-4">Products</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-24">
                            <IoImageOutline />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-24">SKU</TableHead>
                        <TableHead className="w-24">Leads</TableHead>
                        <TableHead className="w-32">Location</TableHead>
                        <TableHead className="w-28">Status</TableHead>
                        <TableHead className="w-28">Stock</TableHead>
                        <TableHead className="w-24"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vendorProducts ? vendorProducts.map((product) => {
                        return (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Image src={product.imgSrc} width={50} height={50} alt={product.name} />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.sku || 'N/A'}</TableCell>
                                <TableCell>{product.leadCount}</TableCell>
                                <TableCell>{product.location}</TableCell>
                                <TableCell>
                                    <Badge variant={product.status === 'publish' ? 'outline' : 'destructive'}>
                                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={product.sold ? 'destructive' : 'outline'}>
                                        {product.sold ? 'Out of Stock' : 'In Stock'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Link href={product.link} target="_blank">
                                        <Button variant="link" size="sm">
                                            View
                                            <IoMdEye />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        );
                    }) : (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center">
                                No products are assigned to this vendor
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table >
        </>
    )
}

export default VendorDetails