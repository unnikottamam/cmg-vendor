import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { userSchema } from "../../validationSchemas/user";
import { auth } from "@/auth";
import { register } from "@/actions/register";

export async function GET() {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN')
        return NextResponse.json({}, { status: 401 });

    const users = await prisma.user.findMany({
        orderBy: { id: 'desc' }
    });
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN')
        return NextResponse.json({}, { status: 401 });

    const body = await request.json();
    const newUserInfo = await register(body);
    if ('error' in newUserInfo) return NextResponse.json(newUserInfo.error, { status: 400 });

    return NextResponse.json(newUserInfo.email, { status: 201 })
}

export async function PUT(request: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN')
        return NextResponse.json({}, { status: 401 });

    const body = await request.json();
    const validation = userSchema.safeParse(body);
    if (!validation.success) return NextResponse.json(validation.error.format(), { status: 400 });

    const user = await prisma.user.findUnique({
        where: { email: body.email }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const updatedUser = await prisma.user.update({
        where: { email: body.email },
        data: {
            phone: body.phone,
            firstName: body.firstName,
            lastName: body.lastName,
            city: body.city,
            state: body.state,
            streetAddress: body.streetAddress,
            zip: body.zip,
            country: body.country.toUpperCase(),
        }
    });

    return NextResponse.json(updatedUser, { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN')
        return NextResponse.json({}, { status: 401 });

    const body = await request.json();
    const validation = userSchema.safeParse(body);
    if (!validation.success) return NextResponse.json(validation.error.format(), { status: 400 });

    const user = await prisma.user.findUnique({
        where: { email: body.email }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const deletedUser = await prisma.user.update({
        where: { email: body.email },
        data: {
            isActive: false
        }
    });

    return NextResponse.json(deletedUser, { status: 200 });
}