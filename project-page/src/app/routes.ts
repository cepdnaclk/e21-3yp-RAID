import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Home from "./components/pages/Home";
import Specifications from "./components/pages/Specifications";
import Architecture from "./components/pages/Architecture";
import TechStack from "./components/pages/TechStack";
import Testing from "./components/pages/Testing";
import Budget from "./components/pages/Budget";
import Team from "./components/pages/Team";
import Gallery from "./components/pages/Gallery";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "specifications", Component: Specifications },
      { path: "architecture", Component: Architecture },
      { path: "tech-stack", Component: TechStack },
      { path: "testing", Component: Testing },
      { path: "budget", Component: Budget },
      { path: "team", Component: Team },
      { path: "gallery", Component: Gallery },
    ],
  },
], { basename: import.meta.env.BASE_URL });
