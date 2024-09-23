import React, { Suspense } from 'react';
import { ThankYou } from './components/thank-you';

const Page = () => {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
};

export default Page;
