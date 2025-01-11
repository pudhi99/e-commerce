// src/components/ui/breadcrumb.jsx
import Link from "next/link";

export function Breadcrumb({ children, className = "" }) {
  return (
    <nav className={`flex items-center space-x-2 ${className}`}>{children}</nav>
  );
}

Breadcrumb.Item = function BreadcrumbItem({ href, children }) {
  if (href) {
    return (
      <>
        <Link href={href} className="text-gray-500 hover:text-gray-700">
          {children}
        </Link>
        <span className="text-gray-500">/</span>
      </>
    );
  }
  return <span className="text-gray-900">{children}</span>;
};
