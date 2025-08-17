import InfiniteScrollWrapper from "~/wrapper/InfiniteScrollWrapper";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Infinite Scroll" }];
}

export default function Home() {
  return <InfiniteScrollWrapper mode="reverse" />;
}
