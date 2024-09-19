import { notFound } from 'next/navigation';
import { db } from '~/db';
import { DesignConfigurator } from './components/design-configurator';

interface DesignPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const DesignPage = async ({ searchParams }: DesignPageProps) => {
  const { id } = searchParams;

  if (!id || typeof id !== 'string') {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  const { height, width, imageUrl } = configuration;

  return <DesignConfigurator configId={id} imageDimensions={{ height, width }} imageUrl={imageUrl} />;
};

export default DesignPage;
