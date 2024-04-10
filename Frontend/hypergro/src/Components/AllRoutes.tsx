import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Liked from "../Pages/Liked";
import Saved from "../Pages/Saved";
import PageNotFound from "../Pages/PageNotFound";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/liked" element={<Liked />} />
      <Route path="/saved" element={<Saved />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AllRoutes;
