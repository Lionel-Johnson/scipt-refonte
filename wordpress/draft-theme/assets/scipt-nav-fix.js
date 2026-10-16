/* Position du bouton Connexion sur toutes les vues SCIPT, y compris Elementor. */
(()=>{
  'use strict';
  function arrange() {
    document.querySelectorAll('.approved-navbar-shell .navbar-nav, nav[aria-label="Navigation principale"] .navbar-nav').forEach(nav=>{
      const links=[...nav.querySelectorAll(':scope > li.nav-item')];
      const contact=links.find(li=>li.querySelector('a[href*="contact.html"],a[href*="page_id=7512"]'));
      const login=links.find(li=>li.querySelector('a.scipt-login-button,a[href*="connexion.html"],a[href*="/mon-compte/"]'));
      if(contact&&login&&contact!==login&&contact.nextElementSibling!==login)contact.after(login);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrange,{once:true});else arrange();
})();