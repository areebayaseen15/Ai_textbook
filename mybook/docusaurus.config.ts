import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical Ai Humanoid Robotics Textbook',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.webp',

  future: {
    v4: true,
  },

  // ✅ YOUR ACTUAL DEPLOYED URL
  url: 'https://aihumanoidtextbook.vercel.app',
  baseUrl: '/',

  // ✅ safer for deployment (no hard fail)
  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/areebayaseen15/Ai_textbook/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/areebayaseen15/Ai_textbook/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',

    colorMode: {
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'My Site',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.webp',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'TextBook',
        },
        {
          to: '/docs/course-overview',
          label: 'Course Overview',
          position: 'left',
        },
        {
          to: '/docs/learning-path/weekly-schedule',
          label: 'Learning Path',
          position: 'left',
        },
        {
          to: '/docs/category/chapter-1-introduction-to-ros2',
          label: 'Modules',
          position: 'left',
        },
        {
          href: 'https://github.com/areebayaseen15/Ai_textbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: '#',
            },
            {
              label: 'X',
              href: '#',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/areeba-yaseen-6523552b5/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Learning Path',
              to: '/docs/learning-path/weekly-schedule',
            },
            {
              label: 'Resources',
              to: '/docs/resources/references',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/areebayaseen15/Ai_textbook',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
