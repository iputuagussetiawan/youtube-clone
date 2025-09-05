import { trpc } from "@/trpc/client";

export default function Home() {
  const {data}= trpc.hello.useQuery({text: "hello world from TRPC"});
  return (
    <div>
      <h1>TRPC Say : {data?.greeting}</h1>
    </div>
  );
}
