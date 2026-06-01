import { useEffect } from 'react';

function BuyMeACoffeeWidget() {
  // From: https://gist.github.com/Evavic44/c43f74247234f2714667944a38b26942

  useEffect(() => {
    const script = document.createElement('script');
    const div = document.getElementById('supportByBMC');
    script.setAttribute('data-name', 'BMC-Widget');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    script.setAttribute('data-id', 'tchakra2');
    script.setAttribute('data-description', 'Support me on Buy me a coffee!');
    script.setAttribute(
      'data-message',
      'Thank you for visiting my website. If this app has helped you in anyway, consider buying us a coffee. ✨😎'
    );
    script.setAttribute('data-color', '#FFDD00');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    script.async = true;
    document.head.appendChild(script);
    script.onload = function() {
      var evt = document.createEvent('Event');
      evt.initEvent('DOMContentLoaded', false, false);
      window.dispatchEvent(evt);
    };

    div.appendChild(script);
  }, []);

  return <div id="supportByBMC"></div>;
}

function BuyMeACoffeeButton() {
  // AI-generated

  return (
    <a
      href="https://buymeacoffee.com/tchakra2"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#FFDD00',
        color: '#000000',
        padding: '8px 0px 8px 16px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontFamily: 'inherit',
        fontSize: '16px',
        textDecoration: 'none',
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)',
      }}>
      <span>Buy me a coffee</span>
      &nbsp;
      <img
        src="https://media4.giphy.com/media/TDQOtnWgsBx99cNoyH/giphy.webp"
        alt="Buy me a coffee!"
        style={{ height: '32px', marginRight: '8px' }}
      />
    </a>
  );
}

export { BuyMeACoffeeWidget, BuyMeACoffeeButton };
