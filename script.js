let notice = document.getElementById('notice').innerHTML;
function UnderDevlopmentLoop(){
  let count = 1;
  setInterval(() => {
    notice = notice + "."
    document.getElementById('notice').innerHTML = notice;
    
  }, 1000);
  
}