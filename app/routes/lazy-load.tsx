import LazyLoadingWrapper from "~/wrapper/LazyLoadingWrapper";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Lazy load images" }];
}

export default function Home() {
  return <LazyLoadingWrapper />;
}
