import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="app-header">
          <h1 className="app-title">Task Management System</h1>
        </header>

        <main className="app-container">
          {children}
        </main>
      </body>
    </html>
  );
}
