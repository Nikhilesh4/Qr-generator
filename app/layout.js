import './globals.css';

export const metadata = {
  title: 'Treasure Hunt QR Generator',
  description: 'LitClub 2026 — Generate QR Codes for Treasure Hunt Locations',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
