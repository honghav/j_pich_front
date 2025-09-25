import Navigation from "../../components/Navigation";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}