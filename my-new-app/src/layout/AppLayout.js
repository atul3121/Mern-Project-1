// import React from 'react'
// import App from '../App';
// import Footer from "./Footer";
// import Header from "./Header";

// function AppLayout({children}) {
//   return (
//     <>
//     <Header/>
//     {children}
//     <Footer/>
//     </>
//   );
// }

// export default AppLayout

import React from 'react';
import Header from './Header'; 
import Footer from './Footer';
import Navigation1 from './Navigation1'; 

function AppLayout({ children }) {
  return (
    <>
     
      <Navigation1 />

      
      <Header />

      {children}
      <Footer />
    </>
  );
}

export default AppLayout;
