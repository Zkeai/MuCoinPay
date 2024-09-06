import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        ios: '430px',
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
    boxShadow: {
      'custom-1': '0 6px 0 0 rgb(0 0 0 / 1%), 0 15px 32px 0 #eda9c324',
    },
    borderRadius: {
      '20px': '20px',
    },

    },
  },
  plugins: [],
};
export default config;
