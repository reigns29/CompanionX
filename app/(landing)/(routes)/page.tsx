import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (<div className="mx-[50px]">
    <div>HomePage</div>
    <button className="bg-orange-400 hover:bg-orange-600 px-4 py-2 rounded-md"><Link href="sign-in">Sign In</Link></button>
    </div>);
};

export default HomePage;
