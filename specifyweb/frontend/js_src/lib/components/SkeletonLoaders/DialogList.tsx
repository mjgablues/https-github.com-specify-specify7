import React from 'react';
import { Skeleton } from './Skeleton';

export function DialogListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="m-2 flex justify-center gap-6">
        <Skeleton.Rectangle className="!w-80" />
      </div>
      {Array.from({ length: 5 }, () => (
        <div className="flex justify-between gap-6">
          <div className="flex items-center gap-4">
            <Skeleton.SmallSquare />
            <Skeleton.Line />
          </div>
          <div className="flex gap-4">
            <Skeleton.Line />
            <Skeleton.Line />
            <Skeleton.SmallCircle />
          </div>
        </div>
      ))}
    </div>
  );
}
