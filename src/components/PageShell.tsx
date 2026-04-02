import Navbar from "./Navbar";

export default function PageShell({ children, title }: any) {
  return (
    <>  
      <Navbar />
    <div style={{ padding: 40 }}>
      <h1>{title}</h1>
      {children}
    </div>
    </>
  );
}
