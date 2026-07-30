<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" fill="none">
  <defs>
    <linearGradient id="fg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#22D3EE"/>
      <stop offset=".5" stop-color="#8B5CF6"/>
      <stop offset="1" stop-color="#FB923C"/>
    </linearGradient>
    <linearGradient id="thermal" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#0EA5E9" stop-opacity=".85"/>
      <stop offset=".45" stop-color="#8B5CF6" stop-opacity=".85"/>
      <stop offset="1" stop-color="#FB923C" stop-opacity=".95"/>
    </linearGradient>
    <clipPath id="screen"><rect x="205" y="79" width="34" height="66" rx="4"/></clipPath>
    <style><![CDATA[
      /* IR-Wellen laufen nach aussen, das Waermebild baut sich von kalt nach warm auf */
      @keyframes waveOut { 0% { opacity: 0; transform: translateX(6px) scaleX(.7); }
                           30% { opacity: 1; }
                           100% { opacity: 0; transform: translateX(-10px) scaleX(1.25); } }
      @keyframes heat    { 0%   { transform: translateY(66px); }
                           45%  { transform: translateY(0); }
                           85%  { transform: translateY(0); }
                           100% { transform: translateY(66px); } }
      @keyframes spot    { 0%, 40% { opacity: 0; r: 3; } 60% { opacity: .95; } 100% { opacity: .2; } }
      @keyframes lensGlow{ 0%,100% { opacity: 1; } 50% { opacity: .5; } }

      .w1 { transform-box: fill-box; transform-origin: right center; animation: waveOut 2.8s ease-out infinite; }
      .w2 { transform-box: fill-box; transform-origin: right center; animation: waveOut 2.8s ease-out infinite .35s; }
      .w3 { transform-box: fill-box; transform-origin: right center; animation: waveOut 2.8s ease-out infinite .7s; }
      .heat { animation: heat 5.5s ease-in-out infinite; }
      .spot { animation: spot 5.5s ease-in-out infinite; }
      .lens { animation: lensGlow 3.2s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .w1,.w2,.w3,.heat,.spot,.lens { animation: none; transform: none; opacity: 1; }
      }
    ]]></style>
  </defs>

  <!-- Infrarot-Wellen -->
  <g stroke="url(#fg)" stroke-width="3" stroke-linecap="round" fill="none">
    <path class="w1" d="M58 96a34 34 0 0 0 0 44"/>
    <path class="w2" d="M40 84a56 56 0 0 0 0 68"/>
    <path class="w3" d="M24 72a80 80 0 0 0 0 92"/>
  </g>

  <!-- Kamerakopf -->
  <rect x="80" y="62" width="152" height="100" rx="20" fill="#0F1828" stroke="#93A7C4" stroke-width="3"/>

  <!-- Objektiv -->
  <circle cx="96" cy="112" r="29" fill="#0F1828" stroke="#93A7C4" stroke-width="3"/>
  <circle class="lens" cx="96" cy="112" r="18" stroke="url(#fg)" stroke-width="3" fill="none"/>
  <circle cx="96" cy="112" r="7" fill="url(#fg)" opacity=".9"/>

  <!-- Display: Wärmebild baut sich auf -->
  <rect x="196" y="70" width="52" height="84" rx="9" fill="#0F1828" stroke="#93A7C4" stroke-width="3"/>
  <g clip-path="url(#screen)">
    <rect x="205" y="79" width="34" height="66" fill="#101B2B"/>
    <rect class="heat" x="205" y="79" width="34" height="66" fill="url(#thermal)"/>
    <circle class="spot" cx="222" cy="104" r="7" fill="#FB923C" opacity=".9"/>
  </g>

  <!-- Griff -->
  <path d="M126 162 L118 244 a16 16 0 0 0 16 18 l26 0 a16 16 0 0 0 16-14 l10 -86 Z" fill="#0F1828" stroke="#93A7C4" stroke-width="3" stroke-linejoin="round"/>
  <path d="M124 178c-9 3-13 12-10 21" stroke="#93A7C4" stroke-width="3" stroke-linecap="round"/>
  <g stroke="#93A7C4" stroke-width="2" opacity=".4" stroke-linecap="round">
    <line x1="132" y1="216" x2="164" y2="216"/>
    <line x1="130" y1="228" x2="162" y2="228"/>
    <line x1="129" y1="240" x2="160" y2="240"/>
  </g>
</svg>
