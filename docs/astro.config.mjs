import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://stellar-ecosystem.github.io',
  base: '/chronostar-docs',
  integrations: [
    starlight({
      title: 'ChronoStar',
      description: 'Time-based payment primitives for the Stellar ecosystem.',
      logo: { src: './src/assets/logo.svg' },
      social: { github: 'https://github.com/Stellar-Program/ChronoStar' },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Overview', link: '/getting-started/overview/' },
            { label: 'Quickstart', link: '/getting-started/quickstart/' },
          ],
        },
        {
          label: 'Contracts',
          items: [
            { label: 'ScheduleVault', link: '/contracts/schedule-vault/' },
            { label: 'RecurringStream', link: '/contracts/recurring-stream/' },
            { label: 'DCAPolicy', link: '/contracts/dca-policy/' },
          ],
        },
        {
          label: 'Keeper',
          items: [
            { label: 'Self-Hosting', link: '/keeper/self-hosting/' },
          ],
        },
        {
          label: 'API',
          items: [
            { label: 'REST Reference', link: '/api/reference/' },
          ],
        },
        {
          label: 'Integration',
          items: [
            { label: 'Lodestar', link: '/integration/lodestar/' },
          ],
        },
      ],
    }),
  ],
});
