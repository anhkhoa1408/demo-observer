import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/lazy-load', 'routes/lazy-load.tsx'),
  route('/infinite-scroll', 'routes/infinite-scroll.tsx'),
] satisfies RouteConfig;
