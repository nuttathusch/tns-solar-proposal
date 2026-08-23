import React from 'react';
import type { ProposalProject } from '../../types/proposal';
import { PageLayout } from './PageLayout';

interface PageSitePicturesProps {
  proposal: ProposalProject;
  pageIndex?: number;
}

export const PageSitePictures: React.FC<PageSitePicturesProps> = ({ proposal, pageIndex = 0 }) => {
  const photos = proposal.media.sitePhotos || [];
  const startIdx = pageIndex * 2;
  const photo1 = photos[startIdx] || '';
  const photo2 = photos[startIdx + 1] || '';

  return (
    <PageLayout subTitle="Site Picture">
      <div className="flex flex-col gap-6 h-full justify-center">
        {/* Photo 1 */}
        <div className="w-full h-[360px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center relative">
          {photo1 ? (
            <img src={photo1} alt={`Site Photo ${startIdx + 1}`} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6 text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-medium text-sm">รูปถ่ายสถานที่จริง / สภาพแวดล้อมหน้างาน {startIdx + 1}</p>
            </div>
          )}
        </div>

        {/* Photo 2 */}
        <div className="w-full h-[360px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center relative">
          {photo2 ? (
            <img src={photo2} alt={`Site Photo ${startIdx + 2}`} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6 text-slate-400">
              <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-medium text-sm">รูปถ่ายสถานที่จริง / สภาพแวดล้อมหน้างาน {startIdx + 2}</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
