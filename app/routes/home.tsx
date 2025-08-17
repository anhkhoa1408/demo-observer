import { Link } from 'react-router';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col gap-4 [&_a]:text-xl [&_a]:hover:text-blue-500">
      <Link to="/lazy-load">Lazy Load</Link>
      <Link to="/infinite-scroll">Infinite Scroll</Link>
    </div>
  );
}
