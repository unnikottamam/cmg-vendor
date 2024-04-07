interface ProductInfo {
    id: string;
    name: string;
    status: string;
    sku: string;
    link: string;
}

interface ProductItem extends ProductInfo {
    location: string;
    imgSrc: string;
    leadCount: number;
    sold: boolean;
}

interface UserBasicInfo {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    company: string | null;
    phone: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}