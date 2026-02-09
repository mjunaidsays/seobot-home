export default function Logo({ href }: { href?: string }) {
  const img = (
    <img
      src="/seoscribed-logo.webp"
      alt="Seoscribed"
      width={240}
      height={160}
      className="h-24 w-auto"
    />
  );

  if (href) {
    return <a href={href}>{img}</a>;
  }

  return img;
}
