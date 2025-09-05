import { trpc } from "@/trpc/server";

export default async function Home() {
  const data= await trpc.hello({text:"from TRPC Server"})
  return (
    <div>
      <h1>TRPC Say : {data.greeting}</h1>
    </div>
  );
}
