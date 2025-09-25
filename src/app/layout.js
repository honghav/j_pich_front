
import Navigation from '../components/Navigation';
import '../app/globals.css';

export const metadata = {
  title: 'My App',
  description: 'Next.js + Laravel',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <Navigation /> */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
