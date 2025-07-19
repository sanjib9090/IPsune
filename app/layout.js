import "./globals.css";

export const metadata = {
  title: "IPsune",
  description: "A music streaming app built with Next.js and React using the JioSaavn API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="https://img.icons8.com/sci-fi/96/apple-music.png" />
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}