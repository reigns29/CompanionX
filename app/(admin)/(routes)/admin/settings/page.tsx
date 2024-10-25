import AccessRestrictedComponent from "@/app/(admin)/components/access-restricted";
import AdminAccessComponent from "@/app/(admin)/components/only-admin";
import GrantAccessForm from "@/app/(admin)/components/grant-access-form";
import { checkAccess } from "@/lib/access";
import React from "react";

const Settings = async () => {
  const userRole = await checkAccess();
  console.log(userRole);

  if(!userRole) return <AccessRestrictedComponent />

  if(userRole && userRole.role !== "super") return <AdminAccessComponent />
  return(
    <div className="p-12">
      <h1 className="text-3xl mb-12">Grant Access to create companions.</h1>
      <GrantAccessForm />
    </div>
  )
};

export default Settings;
