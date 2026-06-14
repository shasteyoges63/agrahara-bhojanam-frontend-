import React from 'react';

interface HowItWorksStepCardProps {
  index: number;
  title: string;
  desc: string;
}

export default function HowItWorksStepCard({ index, title, desc }: HowItWorksStepCardProps) {
  return (
    <div className="ab-step-card bg-[#fff8f0] rounded-xl p-5 md:p-6 flex gap-4 items-start border border-[#c9a227]/20 hover:border-[#c9a227]/45 hover:shadow-md transition-all">
      <div className="w-10 h-10 shrink-0 rounded-full bg-[#5c1a1b] border-2 border-[#c9a227] text-[#f5e6b8] font-bold flex items-center justify-center shadow-md">
        {index + 1}
      </div>
      <div>
        <h3 className="font-serif font-semibold text-[#5c1a1b] mb-1.5">{title}</h3>
        <p className="text-sm text-[#4a3728] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
