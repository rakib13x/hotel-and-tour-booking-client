import React, { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps): ReactNode {
  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {title}
            </h1>
            <div>
              {description && (
                <p className="mt-2 text-muted-foreground">{description}</p>
              )}
            </div>
            {children && <div className="flex-shrink-0">{children}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
