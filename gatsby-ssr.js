/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require('react');

// Set the theme on <html> before first paint so there is no flash of the
// wrong color scheme. The day (black-on-white) theme is the default; night
// is opt-in and remembered once chosen.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

exports.onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    React.createElement('script', {
      key: 'theme-no-flash',
      dangerouslySetInnerHTML: { __html: themeScript },
    }),
  ]);
};
