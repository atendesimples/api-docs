!function(){if("ontouchstart"in window){var t,e,n,i,o,s,c={};t=function(t,e){return Math.abs(t[0]-e[0])>5||Math.abs(t[1]-e[1])>5},e=function(t){this.startXY=[t.touches[0].clientX,t.touches[0].clientY],this.threshold=!1},n=function(e){return this.threshold?!1:void(this.threshold=t(this.startXY,[e.touches[0].clientX,e.touches[0].clientY]))},i=function(e){if(!this.threshold&&!t(this.startXY,[e.changedTouches[0].clientX,e.changedTouches[0].clientY])){var n=e.changedTouches[0],i=document.createEvent("MouseEvents");i.initMouseEvent("click",!0,!0,window,0,n.screenX,n.screenY,n.clientX,n.clientY,!1,!1,!1,!1,0,null),i.simulated=!0,e.target.dispatchEvent(i)}},o=function(t){var e=Date.now(),n=e-c.time,i=t.clientX,o=t.clientY,a=[Math.abs(c.x-i),Math.abs(c.y-o)],r=s(t.target,"A")||t.target,u=r.nodeName,d="A"===u,h=window.navigator.standalone&&d&&t.target.getAttribute("href");return c.time=e,c.x=i,c.y=o,(!t.simulated&&(500>n||1500>n&&a[0]<50&&a[1]<50)||h)&&(t.preventDefault(),t.stopPropagation(),!h)?!1:(h&&(window.location=r.getAttribute("href")),void(r&&r.classList&&(r.classList.add("energize-focus"),window.setTimeout(function(){r.classList.remove("energize-focus")},150))))},s=function(t,e){for(var n=t;n!==document.body;){if(!n||n.nodeName===e)return n;n=n.parentNode}return null},document.addEventListener("touchstart",e,!1),document.addEventListener("touchmove",n,!1),document.addEventListener("touchend",i,!1),document.addEventListener("click",o,!0)}}();