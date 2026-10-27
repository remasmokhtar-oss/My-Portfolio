document.documentElement.classList.add('js-ready');
const menuToggle=document.querySelector('.menu-toggle');
const navLinks=document.querySelector('.nav-links');
const navItems=[...document.querySelectorAll('.nav-link')];
const sections=[...document.querySelectorAll('main section[id]')];
const toTopButton=document.querySelector('.to-top');

function closeMenu(){
  if(!menuToggle||!navLinks)return;
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Open navigation menu');
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
}
if(menuToggle&&navLinks){
  menuToggle.addEventListener('click',()=>{
    const open=menuToggle.getAttribute('aria-expanded')==='true';
    menuToggle.setAttribute('aria-expanded',String(!open));
    menuToggle.setAttribute('aria-label',open?'Open navigation menu':'Close navigation menu');
    navLinks.classList.toggle('open',!open);
    document.body.classList.toggle('menu-open',!open);
  });
  navItems.forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  window.addEventListener('resize',()=>{if(window.innerWidth>850)closeMenu();});
}

const revealItems=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window){
  const observer=new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');obs.unobserve(entry.target);}});
  },{threshold:.12});
  revealItems.forEach(item=>observer.observe(item));
}else revealItems.forEach(item=>item.classList.add('is-visible'));

function updateScrollUI(){
  const marker=window.scrollY+150;
  let current='home';
  sections.forEach(section=>{if(section.offsetTop<=marker)current=section.id;});
  navItems.forEach(link=>{
    const active=link.getAttribute('href')===`#${current}`;
    link.classList.toggle('active',active);
    if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
  });
  if(toTopButton)toTopButton.classList.toggle('visible',window.scrollY>500);
}
window.addEventListener('scroll',updateScrollUI,{passive:true});
updateScrollUI();
toTopButton?.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));

// Project thumbnails are reference designs; links go to Contact until real project URLs are added.
const contactForm=document.querySelector('#contact-form');
document.querySelectorAll('.project-link,.project-image-link').forEach(link=>{
  link.addEventListener('click',()=>{if(contactForm)contactForm.dataset.projectInterest=link.getAttribute('aria-label')||'Project inquiry';});
});

if(contactForm){
  const feedback=document.querySelector('#form-feedback');
  const fields=[...contactForm.querySelectorAll('input,textarea')];
  const nameField=contactForm.elements.name;
  const emailField=contactForm.elements.email;
  const messageField=contactForm.elements.message;

  fields.forEach(field=>field.addEventListener('input',()=>{
    field.removeAttribute('aria-invalid');field.setCustomValidity('');
    if(feedback){feedback.textContent='';feedback.className='form-feedback';}
  }));

  contactForm.addEventListener('submit',event=>{
    event.preventDefault();
    if(!feedback)return;
    feedback.textContent='';feedback.className='form-feedback';
    fields.forEach(field=>{field.removeAttribute('aria-invalid');field.setCustomValidity('');});

    let invalidField=null;
    let error='';
    if(nameField.value.trim().length<2){invalidField=nameField;error='Please enter your name (at least 2 characters).';}
    else if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(emailField.value.trim())){invalidField=emailField;error='Please enter a valid email address.';}
    else if(messageField.value.trim().length<10){invalidField=messageField;error='Please write a message with at least 10 characters.';}

    if(invalidField){
      invalidField.setAttribute('aria-invalid','true');
      invalidField.setCustomValidity(error);
      feedback.textContent=error;feedback.classList.add('error');invalidField.focus();return;
    }
    feedback.textContent='Your message passed validation. This demo does not send messages yet.';
    feedback.classList.add('success');contactForm.reset();
    // To enable delivery later, connect this form to a secure backend or email service.
  });
}
