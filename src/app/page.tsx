import Link from "next/link";

const Page = () => {
  return (
    <div className="font-roboto bg-dark-gray">
      olá <br />
      <Link href="/dashboard">ir para dashboard</Link>
    </div>
  );
}

export default Page;