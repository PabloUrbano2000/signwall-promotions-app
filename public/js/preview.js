(()=>{"use strict";!function(){const e=document.getElementById("archivo")||null,t=document.getElementById("container-img-preview");t&&t.addEventListener("click",(t=>{e.click()})),e&&e.addEventListener("change",(e=>{let t=e.target.files;const n=document.getElementById("container-img-preview");if(n)if(t&&t.length){let e=`<div class="w-auto mx-auto rounded" style="border: 2px gray dotted;">\n                    <img class="p-2 w-auto flex mx-auto rounded" src="${URL.createObjectURL(t[0])}" alt="preview">\n                    </div>`;n.innerHTML=e}else n.innerHTML='<div class="w-auto mx-auto rounded" style="border: 2px gray dotted;">\n                    <p class="text-gray-300 bg-white mx-auto text-center w-auto" style="padding: 70px;">Selecciona una imagen</p>\n                    </div>'}))}()})();