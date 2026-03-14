import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 100,
  duration: "1m"
}

const BASE_URL = "http://192.168.29.240";

let shortUrls = []

export default function (){
  if(Math.random() < 0.3 || shortUrls.length === 0){
    const payload = JSON.stringify({
      longUrl: `https://example.com/${Math.random()}`,
    });
    const params = {
      headers: { "Content-Type": "application/json" },
    };
    const res = http.post(`${BASE_URL}/api/shortner`, payload, params);
    const shortUrl = res.json("shortUrl")
    shortUrls.push(shortUrl)
    check(res,{
      "shorten success": (r) => r.status === 201
    })
  }else{
    const randomUrl = shortUrls[Math.floor(Math.random()*shortUrls.length)];
    const res = http.get(`${BASE_URL}/api/shortner/${randomUrl}`, {
      redirects: 0,
    });

    check(res, {
      "redirect success": (r) =>
        r.status === 301 || r.status === 302,
    });
  }
  sleep(0.5);
}
