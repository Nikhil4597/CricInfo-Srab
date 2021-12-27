const cheerio = require('cheerio');
const request = require('request');
const fs =require('fs');
const { match } = require('assert');
const { log } = require('console');
const { parse } = require('path');
const series_id ="ipl-2020-21-1210595";
const url = "https://www.espncricinfo.com/series/"+series_id+"/match-results";
request(url,cb);
let allMatch =[];
 function cb(err,res,html)
{
    if(err)
    {
        console.log("Error",err);
    }
    else
   {
        const $ =cheerio.load(html);
        const arr =$("a[data-hover='Scorecard']");
        // console.log(arr.length);
       
        for(let i =0;i<arr.length;i++)
        {  
            matchUrl = "https://www.espncricinfo.com/"+$(arr[i]).attr("href");
            let comp = $(arr[i]).attr("href").split("/");
            console.log(matchUrl);
            matchID= comp[3].substring(comp[3].length-7);
            allMatch.push({
                matchName:comp[3].substring(0,comp[3].length-8),
                   
                    batting1: [],
                    bowlling1:[],
                    batting2 :[],
                    bowlling2 :[]  
        
                });

                // console.log(allMatch[0].matchName); 
               request(matchUrl,getScore.bind(this,i,matchID));
        }
    //  console.log(allMatch.length);
     
   } 
}

function getScore(idx,matchID,err,res,html)
 {
     if(err)
     {
         console.log("Error"+err);
     }
     else{
         const $ = cheerio.load(html);
         const teamRes = $(".card.content-block.match-scorecard-table");
         for(let i =0;i<teamRes.length-1;i++)
         {
             let eve= $(teamRes[i]).html();
             getData(idx,i,matchID,eve);
         }
     }
 }

 function getData(idx,attmp,matchID,html){
    const $  = cheerio.load(html);
    const batsmanData =$(".table.batsman tbody tr");
    let bowlerData =$(".table.bowler tbody tr");
    const total = $(".thead-light.bg-light.total td ");
    let ts =$(total).text();
    for(let i =0;i<batsmanData.length ;i++)
    {
        
        let col = $(batsmanData[i]).find("td");
    
         playerName = $(col[0]).text();
         cursorPoint = $(col[1]).text();
         runs =$(col[2]).text();
         balls =$(col[3]).text();
         fours =$(col[5]).text();
         sixes =$(col[6]).text();
        sr =$(col[7]).text();
        totalScore =ts
        if(attmp==0 && playerName!="")
        {
            allMatch[idx].batting1.push({
                "playerName":playerName,
                'cursorPoint':cursorPoint,
                'runs':runs,
                'balls':balls,
                'fours':fours,
                'sixes':sixes,
                'sr':sr,
                // 'totalScore':totalScore
            });
            // console.log(allMatch[idx].batting1.length);
        }
            else if(attmp==1 && playerName!="")
            {
                allMatch[idx].batting2.push({
                    "playerName":playerName,
                    'cursorPoint':cursorPoint,
                    'runs':runs,
                    'balls':balls,
                    'fours':fours,
                    'sixes':sixes,
                    'sr':sr,
                    // 'totalScore':totalScore
     
                });
                // console.log(allMatch[idx].batting2.length);
       }
            
        // console.log(`${playerName}  ${cursorPoint}  ${runs} ${balls}  ${fours}  ${sixes} ${sr}`);
    }
    for(let i =0;i<bowlerData.length;i++)
    {
        
        let col = $(bowlerData[i]).find("td");
        let playerName =$(col[0]).text();
        let over =$(col[1]).text();
        let madenOver=$(col[2]).text();
        let runs =$(col[3]).text();
        let wicket =$(col[4]).text();
        let Econ =$(col[5]).text();
        let zeros =$(col[6]).text();
        let fours =$(col[7]).text();
        let sixes =$(col[8]).text();
        let wide =$(col[9]).text();
        let noBall =$(col[10]).text();
        //  console.log(`Bolwer ${playerName}  ${over}  ${madenOver}  ${runs}  ${wicket}  ${Econ}  ${zeros}  ${fours}  ${sixes}  ${wide}  ${noBall} `);
         if(attmp==0 && playerName!="")
         {
             allMatch[idx].bowlling1.push({
                 'playerName':playerName,
                 'over' :over,
                 'madenOver':madenOver,
                 'runs':runs,
                 'wicket':wicket,
                 'Econ':Econ,
                 'zeros':zeros,
                 'fours':fours,
                 'sixes':sixes,
                 'wide':wide,
                 'noBall':noBall

             });
         }
         else if(attmp==1&&playerName!="")
         {
             allMatch[idx].bowlling2.push({
                 'playerName':playerName,
                 'over' :over,
                 'madenOver':madenOver,
                 'runs':runs,
                 'wicket':wicket,
                 'Econ':Econ,
                 'zeros':zeros,
                 'fours':fours,
                 'sixes':sixes,
                 'wide':wide,
                 'noBall':noBall

             });
        
    }
    
    }
let ftb = allMatch[idx].batting1;
let stb = allMatch[idx].batting2;
let ftbw = allMatch[idx].bowlling1;
let stbw = allMatch[idx].bowlling2;
 let team1bat =idx+"_1stTeamBat_"+matchID+".json";
 let team1ball=+idx+"_1stTeamBall_"+matchID+".json";
 let team2bat = idx+"_2ndTeamBat_"+matchID+'.json';
 let team2ball =idx+"_2ndTeamBall_"+matchID+'.json';  
 fs.writeFileSync(team1bat,JSON.stringify(ftb));
 fs.writeFileSync(team2bat,JSON.stringify(stb));
     fs.writeFileSync(team1ball,JSON.stringify(ftbw));
    fs.writeFileSync(team2ball,JSON.stringify(stbw));
     
}