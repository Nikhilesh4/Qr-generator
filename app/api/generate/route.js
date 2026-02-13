import QRCode from 'qrcode';
import { NextResponse } from 'next/server';

const LOCATIONS = [
    { internalName: 'UD Location 1', world: 'upside_down', qrSecret: 'UD_LOC1_a1b2', isFake: false },
    { internalName: 'UD Location 2', world: 'upside_down', qrSecret: 'UD_LOC2_c3d4', isFake: false },
    { internalName: 'UD Location 3', world: 'upside_down', qrSecret: 'UD_LOC3_e5f6', isFake: false },
    { internalName: 'UD Location 4', world: 'upside_down', qrSecret: 'UD_LOC4_g7h8', isFake: false },
    { internalName: 'UD Location 5', world: 'upside_down', qrSecret: 'UD_LOC5_i9j0', isFake: false },
    { internalName: 'UD Location 6', world: 'upside_down', qrSecret: 'UD_LOC6_k1l2', isFake: false },
    { internalName: 'UD Location 7', world: 'upside_down', qrSecret: 'UD_LOC7_m3n4', isFake: false },
    { internalName: 'UD Location 8', world: 'upside_down', qrSecret: 'UD_LOC8_o5p6', isFake: false },
    { internalName: 'RW Location 1', world: 'real_world', qrSecret: 'RW_LOC1_q7r8', isFake: false },
    { internalName: 'RW Location 2', world: 'real_world', qrSecret: 'RW_LOC2_s9t0', isFake: false },
    { internalName: 'RW Location 3', world: 'real_world', qrSecret: 'RW_LOC3_u1v2', isFake: false },
    { internalName: 'RW Location 4', world: 'real_world', qrSecret: 'RW_LOC4_w3x4', isFake: false },
    { internalName: 'RW Location 5', world: 'real_world', qrSecret: 'RW_LOC5_y5z6', isFake: false },
    { internalName: 'RW Location 6', world: 'real_world', qrSecret: 'RW_LOC6_a7b8', isFake: false },
    { internalName: 'RW Location 7', world: 'real_world', qrSecret: 'RW_LOC7_c9d0', isFake: false },
    { internalName: 'RW Location 8', world: 'real_world', qrSecret: 'RW_LOC8_e1f2', isFake: false },
    { internalName: 'Fake - Near Library', world: null, qrSecret: 'FAKE_LIB_x1y2', isFake: true },
    { internalName: 'Fake - Mess Noticeboard', world: null, qrSecret: 'FAKE_MESS_z3w4', isFake: true },
    { internalName: 'Fake - Parking Lot', world: null, qrSecret: 'FAKE_PARK_v5u6', isFake: true },
];

export async function POST(request) {
    try {
        const { qrSecret, baseUrl } = await request.json();

        if (!qrSecret || !baseUrl) {
            return NextResponse.json(
                { error: 'Both qrSecret and baseUrl are required' },
                { status: 400 }
            );
        }

        // Look up location info
        const location = LOCATIONS.find((l) => l.qrSecret === qrSecret);

        const scanUrl = `${baseUrl.replace(/\/+$/, '')}/scan/${qrSecret}`;
        const qrDataUrl = await QRCode.toDataURL(scanUrl, {
            width: 500,
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' },
        });

        return NextResponse.json({
            qrDataUrl,
            scanUrl,
            location: location || null,
        });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// GET: generate all QR codes at once
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const baseUrl = searchParams.get('baseUrl') || 'https://hunt.example.com';

        const results = [];
        for (const loc of LOCATIONS) {
            const scanUrl = `${baseUrl.replace(/\/+$/, '')}/scan/${loc.qrSecret}`;
            const qrDataUrl = await QRCode.toDataURL(scanUrl, {
                width: 400,
                margin: 2,
            });
            results.push({ ...loc, scanUrl, qrDataUrl });
        }

        return NextResponse.json({ locations: results });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
