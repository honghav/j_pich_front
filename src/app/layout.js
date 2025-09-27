
import Navigation from '../components/Navigation';
import '../app/globals.css';

export const metadata = {
  title: 'ឆាយ សៀវឡាយ​ កាត់កញ្ជក់',
  description: 'កាត់កញ្ជក់​ ស្រុកស្នួល ខេត្តក្រចេះ',
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
