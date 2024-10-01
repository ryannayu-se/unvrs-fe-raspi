import Link from "next/link";

export default function Trend() {
    return (
        <div className="p-4">
            <h2 className="text-2xl my-2">Trend</h2>
            <Link className="underline" href="/">
                Go To Home
            </Link>
        </div>
    )
  }