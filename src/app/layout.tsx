import '../index.css';

export const metadata = {
  title: 'My App',
  description: 'Next.js app with MCP support',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
