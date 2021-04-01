import "./styles.css";
import React, { useRef, useEffect } from 'react';

function App() {
  const canvas = useRef();
  let ctx = null;


  // initialize the canvas context
  useEffect(() => {
    // dynamically assign the width and height to canvas
    const canvasEle = canvas.current;
    canvasEle.width = 1200;
    canvasEle.height = 800;
    // get context of the canvas
    ctx = canvasEle.getContext("2d");

  }, []);

  useEffect(() => {
      //annan funktsioonile punktide koordinaadid, mida nool peab labima
    joonista([[120, 140], [180, 150], [230, 200], [280, 170], [350, 185], [375, 135]]);

    mootkava(150, 400);
  }, []);

  //sihivektori leidmine kahe punktiga, y'i leidmine on vastupidi, sest koordinaatteljestiku y telg canvasel on allapoole positiivne
  function sihivektor(x1, y1, x2, y2)   {
      return([x2-x1, y1-y2]);
  }
  //leian sihivektorile kaks normaalvektorit
  function normaalvektorid([sx, sy])    {
      return([sy, sx, -sy, -sx]);
  }
  //votan molemad normaalvektorid ja muudan nad 1km pikkuseks, kuna minu mootkavas 1km on 10 pikslit, leian uhikvektori ja korrutan ta 10'ga
  function uhikvektor1km([nx1, ny1, nx2, ny2])    {
      var npikkus = Math.sqrt(Math.pow(nx1, 2)+ Math.pow(ny1, 2));
      npikkus = npikkus/10;
      return([(nx1)/npikkus, (ny1)/npikkus, (nx2)/npikkus, (ny2)/npikkus])
  }
  //1km normaalvektoritega ja punktiga teljel leian 1km kaugusel asuva punkti, mis on risti telje alguspunktiga
  function punkt_1km_kaugusel(x1, y1, x2, y2)   {
      const [uhikvektorx1, uhikvektory1, uhikvektorx2, uhikvektory2] = uhikvektor1km(normaalvektorid(sihivektor(x1, y1, x2, y2)));
      return([x1+uhikvektorx1, y1+uhikvektory1, x1+uhikvektorx2, y1+uhikvektory2]);
  }
  //sama funktsioon, mis eelmine aga telje lopp-punkti kohta
  function punkt_1km_kaugusel_tagumine(x1, y1, x2, y2)   {
      const [uhikvektorx1, uhikvektory1, uhikvektorx2, uhikvektory2] = uhikvektor1km(normaalvektorid(sihivektor(x1, y1, x2, y2)));
      return([x2+uhikvektorx1, y2+uhikvektory1, x2+uhikvektorx2, y2+uhikvektory2]);
  }
  //kahemootmelise determinandi lahendamine
  function determinant(a1, b1, a2, b2)  {
      return((a1*b2) - (a2* b1));
  }
  function x_arvutamine_Cramer(a1, b1, c1, a2, b2, c2)   {
      return(determinant(c1, b1, c2, b2)/determinant(a1, b1, a2, b2));
  }
  function y_arvutamine_Cramer(a1, b1, c1, a2, b2, c2)   {
      return(determinant(a1, c1, a2, c2)/determinant(a1, b1, a2, b2));
  }
  function loikepunktid(x1, y1, x2, y2, x3, y3)   {
      //kolme punkti abil leian kaks sihivektorit ja neli punkti mis asuvad 1km kaugusel teljest
      //nende abil saan luua sirged kahe tundmatuga, mida on kerge lahendada Crameri valemiga ehk siis determinandiga lineaarsusteemi lahendamine
      //tulemuseks saan loikepunktid sirgetele ehk siis tapselt need punktid, mida vaja, et oma noolt joonistada
      var [s1x, s1y] = sihivektor(x1, y1, x2, y2);
      var [s2x, s2y] = sihivektor(x2, y2, x3, y3);
      var [alguspunkt1x, alguspunkt1y, alguspunkt2x, alguspunkt2y] = punkt_1km_kaugusel(x1, y1, x2, y2);
      var [lopppunkt1x, lopppunkt1y, lopppunkt2x, lopppunkt2y] = punkt_1km_kaugusel(x2, y2, x3, y3);


      return([
        x_arvutamine_Cramer(s1y, s1x, (alguspunkt1x*s1y + alguspunkt1y*s1x), s2y, s2x, (lopppunkt1x*s2y + lopppunkt1y*s2x)),
        y_arvutamine_Cramer(s1y, s1x, (alguspunkt1x*s1y + alguspunkt1y*s1x), s2y, s2x, (lopppunkt1x*s2y + lopppunkt1y*s2x)),
        x_arvutamine_Cramer(s1y, s1x, (alguspunkt2x*s1y + alguspunkt2y*s1x), s2y, s2x, (lopppunkt2x*s2y + lopppunkt2y*s2x)),
        y_arvutamine_Cramer(s1y, s1x, (alguspunkt2x*s1y + alguspunkt2y*s1x), s2y, s2x, (lopppunkt2x*s2y + lopppunkt2y*s2x))]);
  }
  function joonista(punktid) {
      //teen muutujate massiivid, esimesse salvestan joonte alguspunktide koordinaadid ja teise noolte lopp-punktide koordinaadid
      //alguses on need sama vaartusega
      var[xvasak, yvasak, xparem, yparem] = punkt_1km_kaugusel(punktid[0][0], punktid[0][1], punktid[1][0], punktid[1][1]);
      var[xvasak_temp, yvasak_temp, xparem_temp, yparem_temp] = [xvasak, yvasak, xparem, yparem];
      //maaran joone stiili
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      //tsukkel, mis labib koik punktid
      for(var i = 0; i < punktid.length; i++)   {
          //kuni pole lopu lahedal, votan kolm punkti, mis on minimaalne arv, et arvutada joonte loikumispunkte
          if(i+2 < punktid.length) {
              ctx.beginPath();
              //kasutan funktsiooni loikepunktid, et gumnaasiumist meelde tuletatud sirgete valemitega nende punktide abil noole joonistamiseks
              //vajalikud punktid leida, tapsemalt kommenteeritud funktsioonis sees
              [xvasak_temp, yvasak_temp, xparem_temp, yparem_temp] = loikepunktid(punktid[i][0], punktid[i][1], punktid[i+1][0], punktid[i+1][1],
              punktid[i+2][0], punktid[i+2][1]);
              //joonistan jooned vasakule ja paremale poole telge
              ctx.moveTo(xvasak, yvasak);
              ctx.lineTo(xvasak_temp, yvasak_temp);
              ctx.moveTo(xparem, yparem);
              ctx.lineTo(xparem_temp, yparem_temp);
              ctx.stroke();
              //muudan joone alguskoordinaate
              [xvasak, yvasak, xparem, yparem] = [xvasak_temp, yvasak_temp, xparem_temp, yparem_temp];
          }
          else if(i + 2 == punktid.length)  {
              //leian nagu alguses lihtsalt teljega risti olevad punktid 1km kaugusel teljest
              [xvasak_temp, yvasak_temp, xparem_temp, yparem_temp] = punkt_1km_kaugusel_tagumine(punktid[i][0], punktid[i][1], punktid[i+1][0], punktid[i+1][1]);
              ctx.moveTo(xvasak, yvasak);
              ctx.lineTo(xvasak_temp, yvasak_temp);
              ctx.moveTo(xparem, yparem);
              ctx.lineTo(xparem_temp, yparem_temp);
              ctx.stroke();
          }
          else if(i + 1 == punktid.length)   {
              //kasutan uhikvektori leidmist, aga leian 2km pikkuse sihivektori, mille ots oleks noole tipp
              var npikkus = Math.sqrt(Math.pow((punktid[i][0]-punktid[i-1][0]), 2)+ Math.pow((punktid[i][1]-punktid[i-1][1]), 2));
              npikkus = npikkus/20;
              var tippx = (punktid[i][0]-punktid[i-1][0]) / npikkus + punktid[i][0];
              var tippy = (punktid[i][1]-punktid[i-1][1]) / npikkus + punktid[i][1];
              //kuna funktsioon 'punkt_1km_kaugusel_tagumine' annab molemale poole joont mulle kaugused,
              //maaran ebavajalikud muutujad prugiks. leidsin et olemasoleva funktsiooni kasutamine on mugavam kuigi ta annab liiga palju muutujaid mulle
              var [aar1x, aar1y, prugix, prugiy] = punkt_1km_kaugusel_tagumine(xvasak, yvasak, xvasak_temp, yvasak_temp);
              var [prugi1x, prugi1y, aar2x, aar2y] = punkt_1km_kaugusel_tagumine(xparem, yparem, xparem_temp, yparem_temp);

              ctx.moveTo(aar1x, aar1y);
              ctx.lineTo(xvasak_temp, yvasak_temp);
              ctx.moveTo(aar2x, aar2y);
              ctx.lineTo(xparem_temp, yparem_temp);
              ctx.moveTo(aar2x, aar2y);
              ctx.lineTo(tippx, tippy);
              ctx.moveTo(aar1x, aar1y);
              ctx.lineTo(tippx, tippy);
              ctx.stroke();
          }
      }


  }

  function mootkava(mootkavax, mootkavay)   {
      //mootkava jaoks tegin kiirelt loppu moned jooned ja numbrid peale
      ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
      ctx.moveTo(mootkavax, mootkavay);
      ctx.lineTo(mootkavax+10, mootkavay);
      ctx.stroke();
          ctx.beginPath();
            ctx.strokeStyle = 'grey';
            ctx.lineWidth = 3   ;
      ctx.moveTo(mootkavax+10, mootkavay);
      ctx.lineTo(mootkavax+20, mootkavay);
      ctx.stroke();
          ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
      ctx.moveTo(mootkavax+20, mootkavay);
      ctx.lineTo(mootkavax+30, mootkavay);
      ctx.fillText("0", mootkavax-2, mootkavay-5);
      ctx.fillText("1", mootkavax+8, mootkavay-5);
      ctx.fillText("2", mootkavax+18, mootkavay-5);
      ctx.fillText("3", mootkavax+28, mootkavay-5);
      ctx.stroke();

  }
  return (
    <div className="App">
      <canvas ref={canvas}></canvas>
    </div>
  );
}

export default App;
