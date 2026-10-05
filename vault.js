(function(){
var SALT='noIULck3oEuZlzu4PzFwEA==',ITER=310000,SK='as-vault-key';
function d(s){return Uint8Array.from(atob(s),function(c){return c.charCodeAt(0)})}
function e(b){var u=new Uint8Array(b),s='';for(var i=0;i<u.length;i++)s+=String.fromCharCode(u[i]);return btoa(s)}
function derive(pw){return crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']).then(function(b){return crypto.subtle.deriveKey({name:'PBKDF2',salt:d(SALT),iterations:ITER,hash:'SHA-256'},b,{name:'AES-GCM',length:256},true,['decrypt'])})}
async function open(key,remember){var v=document.getElementById('vault');if(!v)return;var pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:d(v.dataset.iv)},key,d(v.textContent.trim()));var data=JSON.parse(new TextDecoder().decode(pt));if(remember){try{sessionStorage.setItem(SK,e(await crypto.subtle.exportKey('raw',key)))}catch(x){}}v.remove();window.onVaultOpen&&window.onVaultOpen(data)}
async function stored(){var s;try{s=sessionStorage.getItem(SK)}catch(x){}if(!s)return;try{var k=await crypto.subtle.importKey('raw',d(s),'AES-GCM',true,['decrypt']);await open(k,false)}catch(x){try{sessionStorage.removeItem(SK)}catch(y){}}}
function bind(){var f=document.getElementById('gate-form');if(!f)return;var pw=document.getElementById('gate-pw'),err=document.getElementById('gate-err'),btn=f.querySelector('button'),label=btn.innerHTML;
f.addEventListener('submit',async function(ev){ev.preventDefault();err.textContent='';btn.disabled=true;btn.textContent='Unlocking...';try{await open(await derive(pw.value),true)}catch(x){err.textContent="That password didn't work. Try again, or request access below.";pw.select()}finally{if(btn.isConnected){btn.disabled=false;btn.innerHTML=label}}})}
function init(){if(!window.crypto||!crypto.subtle){var er=document.getElementById('gate-err');if(er)er.textContent='Your browser blocks decryption on this connection. Open the site over https.';return}bind();stored()}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
