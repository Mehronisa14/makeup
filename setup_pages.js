const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const stitchDir = path.join(baseDir, 'stitch_glamora_luxury_cosmetics_storefront');

const homeFile = path.join(stitchDir, 'glamora_beauty_homepage', 'code.html');
const shopFile = path.join(stitchDir, 'glamora_beauty_shop_all_collection', 'code.html');
const prodFile = path.join(stitchDir, 'glamora_beauty_product_detail_page', 'code.html');

let homeHtml = fs.readFileSync(homeFile, 'utf8');
let shopHtml = fs.readFileSync(shopFile, 'utf8');
let prodHtml = fs.readFileSync(prodFile, 'utf8');

// Prototype switcher component that works seamlessly across all 3 pages
function getSwitcherHtml(activePage) {
  return `
<!-- Floating Prototype Screen Switcher -->
<aside id="stitch-nav-bar" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 99999; font-family: 'Plus Jakarta Sans', system-ui, sans-serif;">
  <div style="background: rgba(32, 26, 24, 0.94); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 9999px; padding: 6px 10px; display: flex; align-items: center; gap: 6px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);">
    <span style="color: #d0c4c0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 0 8px 0 6px; display: flex; align-items: center; gap: 4px;">
      <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #fcb69e;"></span>
      Glamora
    </span>
    <a href="index.html" style="padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-decoration: none; transition: all 0.2s; ${activePage === 'home' ? 'background: #ffffff; color: #201a18; box-shadow: 0 2px 6px rgba(0,0,0,0.2);' : 'color: #f3f0ed; opacity: 0.75;'}">
      🏠 Homepage
    </a>
    <a href="shop.html" style="padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-decoration: none; transition: all 0.2s; ${activePage === 'shop' ? 'background: #ffffff; color: #201a18; box-shadow: 0 2px 6px rgba(0,0,0,0.2);' : 'color: #f3f0ed; opacity: 0.75;'}">
      🛍️ Shop All
    </a>
    <a href="product.html" style="padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-decoration: none; transition: all 0.2s; ${activePage === 'product' ? 'background: #ffffff; color: #201a18; box-shadow: 0 2px 6px rgba(0,0,0,0.2);' : 'color: #f3f0ed; opacity: 0.75;'}">
      💄 Product Detail
    </a>
    <button onclick="document.getElementById('stitch-nav-bar').style.display='none'" title="Hide switcher" style="background: none; border: none; color: #a09794; cursor: pointer; padding: 4px; display: flex; align-items: center; margin-left: 2px;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  </div>
</aside>
`;
}

// 1. Process Homepage
// Wire brand logo to index.html
homeHtml = homeHtml.replace(/<a class="font-headline-md text-headline-md tracking-wider text-primary uppercase font-bold select-none" href="#">/g, '<a class="font-headline-md text-headline-md tracking-wider text-primary uppercase font-bold select-none" href="index.html">');
homeHtml = homeHtml.replace(/<a class="font-headline-md text-headline-md tracking-widest text-primary uppercase font-bold inline-block" href="#">/g, '<a class="font-headline-md text-headline-md tracking-widest text-primary uppercase font-bold inline-block" href="index.html">');

// Wire "Shop All" links to shop.html
homeHtml = homeHtml.replace(/<a class="text-primary border-b border-primary pb-1" href="#hero">Shop All<\/a>/g, '<a class="text-primary border-b border-primary pb-1" href="shop.html">Shop All</a>');
homeHtml = homeHtml.replace(/<a class="text-primary font-bold" href="#hero">Shop All<\/a>/g, '<a class="text-primary font-bold" href="shop.html">Shop All</a>');

// Wire CTA buttons to shop.html
homeHtml = homeHtml.replace(/href="#bestsellers">Shop The Best Sellers<\/a>/g, 'href="shop.html">Shop The Best Sellers</a>');
homeHtml = homeHtml.replace(/href="#categories">Explore The Collection<\/a>/g, 'href="shop.html">Explore The Collection</a>');

// Wire Lumière Velvet Matte Lip Couture to product.html
homeHtml = homeHtml.replace(/Lumière Velvet Matte Lip Couture/g, 'Lumière Velvet Matte Lip Couture');
homeHtml = homeHtml.replace(/<h3 class="font-headline-sm text-headline-sm text-primary mb-2 line-clamp-1">\s*Lumière Velvet Matte Lip Couture\s*<\/h3>/g, 
  '<h3 class="font-headline-sm text-headline-sm text-primary mb-2 line-clamp-1"><a href="product.html" class="hover:text-secondary transition-colors">Lumière Velvet Matte Lip Couture</a></h3>');

// Insert prototype bar before </body>
homeHtml = homeHtml.replace('</body>', getSwitcherHtml('home') + '\n</body>');
fs.writeFileSync(path.join(baseDir, 'index.html'), homeHtml, 'utf8');
console.log('Written index.html');

// 2. Process Shop All Collection
// Wire brand logo to index.html
shopHtml = shopHtml.replace(/<a class="font-headline-md text-headline-md tracking-wider text-primary[^"]*" href="#">/g, '<a class="font-headline-md text-headline-md tracking-wider text-primary dark:text-inverse-primary uppercase font-bold select-none" href="index.html">');
shopHtml = shopHtml.replace(/<a class="hover:text-primary transition-colors" href="#">Home<\/a>/g, '<a class="hover:text-primary transition-colors" href="index.html">Home</a>');

// Wire products to product.html
shopHtml = shopHtml.replace(/<h3 class="font-headline-sm text-headline-sm text-primary[^>]*>\s*Lumière Velvet Matte Lip Couture\s*<\/h3>/g,
  '<h3 class="font-headline-sm text-headline-sm text-primary dark:text-inverse-surface mb-1 leading-tight"><a href="product.html" class="hover:text-secondary transition-colors">Lumière Velvet Matte Lip Couture</a></h3>');

shopHtml = shopHtml.replace('</body>', getSwitcherHtml('shop') + '\n</body>');
fs.writeFileSync(path.join(baseDir, 'shop.html'), shopHtml, 'utf8');
console.log('Written shop.html');

// 3. Process Product Detail Page
// Wire brand logo to index.html
prodHtml = prodHtml.replace(/<a class="font-headline-md text-headline-md tracking-wider text-primary uppercase transition-all duration-300 select-none font-bold" href="#">/g, '<a class="font-headline-md text-headline-md tracking-wider text-primary uppercase transition-all duration-300 select-none font-bold" href="index.html">');
prodHtml = prodHtml.replace(/<a class="hover:text-primary transition-colors" href="#">Home<\/a>/g, '<a class="hover:text-primary transition-colors" href="index.html">Home</a>');
prodHtml = prodHtml.replace(/<a class="hover:text-primary transition-colors" href="#">Shop All<\/a>/g, '<a class="hover:text-primary transition-colors" href="shop.html">Shop All</a>');
prodHtml = prodHtml.replace(/<a class="text-on-surface-variant hover:text-primary transition-colors pb-1" href="#">Shop All<\/a>/g, '<a class="text-on-surface-variant hover:text-primary transition-colors pb-1" href="shop.html">Shop All</a>');

prodHtml = prodHtml.replace('</body>', getSwitcherHtml('product') + '\n</body>');
fs.writeFileSync(path.join(baseDir, 'product.html'), prodHtml, 'utf8');
console.log('Written product.html');
