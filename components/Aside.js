// "use client";
import React from 'react';

const Aside = ({ title, content, children, className }) => {
<aside
        id="patch_management"
        className={`leftSide fixed top-5 right-2 z-40 w-4/5 bg-white cust_h-56 transition-transform -translate-x-full sm:translate-x-0 p-8 ${className}`}>
        {children}
      </aside>
}


export default Aside;