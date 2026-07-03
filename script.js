const languageButtons = document.querySelectorAll('.language-switch button');
const translatable = document.querySelectorAll('[data-es][data-en]');
const localizedPlaceholders = document.querySelectorAll('[data-placeholder-es][data-placeholder-en]');
const floatingWhatsApp = document.querySelector('.floating-whatsapp');
let language = 'en';

const packageNames = {
  essential: { es: 'Esencial', en: 'Essential' },
  growth: { es: 'Crecimiento', en: 'Growth' },
  pro: { es: 'Negocio Pro', en: 'Business Pro' }
};

const extraNames = {
  bilingual: { es: 'Inglés + español', en: 'English + Spanish' },
  google: { es: 'Perfil de Google', en: 'Google Business Profile' },
  logo: { es: 'Logo básico', en: 'Basic logo' },
  care: { es: 'Plan de cuidado mensual', en: 'Monthly care plan' }
};

const packageInputs = document.querySelectorAll('input[name="package"]');
const addonInputs = document.querySelectorAll('.addon-list input');
const estimateTotal = document.querySelector('#estimate-total');
const monthlyTotal = document.querySelector('#monthly-total');
const currencySymbol = document.querySelector('#currency-symbol');
const currencyLabel = document.querySelector('#currency-label');
const monthlyRow = document.querySelector('.monthly-total');
const selectedPackage = document.querySelector('#selected-package');
const selectedExtras = document.querySelector('#selected-extras');
const quoteWhatsApp = document.querySelector('#quote-whatsapp');

function updateEstimate() {
  const activePackage = document.querySelector('input[name="package"]:checked');
  if (!activePackage) return;

  let oneTime = language === 'es' ? 1000 : Number(activePackage.dataset.price);
  let monthly = 0;
  const extras = [];
  let hasPaidExtras = false;

  addonInputs.forEach((input) => {
    if (!input.checked) return;
    const price = Number(input.dataset.price);
    if (price > 0) hasPaidExtras = true;
    if (language === 'en') {
      if (input.dataset.monthly === 'true') monthly += price;
      else oneTime += price;
    }
    extras.push(extraNames[input.value][language]);
  });

  const packageName = packageNames[activePackage.value][language];
  const quoteOnly = language === 'es'
    && (activePackage.value !== 'essential' || hasPaidExtras);

  estimateTotal.parentElement.classList.toggle('quote-only', quoteOnly);
  monthlyRow.classList.toggle('is-hidden', quoteOnly);

  if (quoteOnly) {
    currencySymbol.textContent = '';
    estimateTotal.textContent = 'Cotizar';
    currencyLabel.textContent = '';
  } else {
    currencySymbol.textContent = '$';
    estimateTotal.textContent = oneTime.toLocaleString(language === 'es' ? 'es-MX' : 'en-US');
    currencyLabel.textContent = language === 'es' ? 'MXN' : 'USD';
    monthlyTotal.textContent = monthly;
  }

  selectedPackage.textContent = `${language === 'es' ? 'Paquete' : 'Package'} ${packageName}`;
  selectedExtras.textContent = extras.length
    ? extras.join(' · ')
    : language === 'es' ? 'Sin extras seleccionados' : 'No extras selected';

  const message = language === 'es'
    ? quoteOnly
      ? `Hola, quiero cotizar el paquete ${packageName}. Extras: ${extras.length ? extras.join(', ') : 'ninguno'}. ¿Podemos hablar de mi proyecto?`
      : `Hola, me interesa el paquete ${packageName} con precio base de $1,000 MXN. Extras: ${extras.length ? extras.join(', ') : 'ninguno'}. ¿Podemos hablar de mi proyecto?`
    : `Hi, I'm interested in the ${packageName} package. My estimate is $${oneTime} USD${monthly ? ` plus $${monthly} USD/month` : ''}. Extras: ${extras.length ? extras.join(', ') : 'none'}. Can we discuss my project?`;
  quoteWhatsApp.href = `https://wa.me/16024006607?text=${encodeURIComponent(message)}`;
}

function applyLanguage(nextLanguage) {
  language = nextLanguage;
  document.documentElement.lang = language;
  translatable.forEach((element) => {
    element.textContent = element.dataset[language];
  });
  localizedPlaceholders.forEach((element) => {
    element.placeholder = element.dataset[`placeholder${language === 'es' ? 'Es' : 'En'}`];
  });
  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  document.title = language === 'es'
    ? 'L&R Webs | Diseño web en Phoenix, AZ'
    : 'L&R Webs | Web Design in Phoenix, AZ';
  if (floatingWhatsApp) {
    const quickMessage = language === 'es'
      ? 'Hola, me interesa una página web para mi negocio.'
      : "Hi, I'm interested in a website for my business.";
    floatingWhatsApp.href = `https://wa.me/16024006607?text=${encodeURIComponent(quickMessage)}`;
  }
  updateEstimate();
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.dataset.lang));
});

packageInputs.forEach((input) => input.addEventListener('change', updateEstimate));
addonInputs.forEach((input) => input.addEventListener('change', updateEstimate));

document.querySelectorAll('.choose-package').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.querySelector(`input[name="package"][value="${button.dataset.package}"]`);
    if (!input) return;
    input.checked = true;
    updateEstimate();
    document.querySelector('#cotizador').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const leadForm = document.querySelector('#lead-form');
leadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(leadForm);
  const serviceSelect = leadForm.querySelector('[name="service"]');
  const service = serviceSelect.options[serviceSelect.selectedIndex].text;
  const name = data.get('name');
  const business = data.get('business');
  const phone = data.get('phone') || (language === 'es' ? 'No proporcionado' : 'Not provided');
  const budget = data.get('budget');
  const details = data.get('details') || (language === 'es' ? 'Sin detalles adicionales' : 'No additional details');
  const message = language === 'es'
    ? `Hola Enrique, soy ${name} de ${business}.\n\nServicio: ${service}\nPresupuesto: ${budget}\nTeléfono: ${phone}\nDetalles: ${details}\n\nMe gustaría recibir una recomendación para mi negocio.`
    : `Hi Enrique, I'm ${name} from ${business}.\n\nService: ${service}\nBudget: ${budget}\nPhone: ${phone}\nDetails: ${details}\n\nI'd like a recommendation for my business.`;
  window.open(`https://wa.me/16024006607?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

document.querySelector('#year').textContent = new Date().getFullYear();
applyLanguage('en');
