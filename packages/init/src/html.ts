import { getLocalIp, getPublicIp, randomKey } from './ip'
import e from 'express'

const emojis = {
  question: '❓',
  check: '✅',
  cross: '❌',
}

export const getPage = async () => {
  const publicIp = await getPublicIp()
  const localIp = getLocalIp()
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Initialize template server</title>
    <script>
    async function testPort(port){
       const result = await fetch("http://${publicIp}:"+port+"/test").then(r=>r.text()).catch(()=>"")
        document.getElementById("test"+port).innerHTML = result==="${randomKey}" ? '${emojis.check}' : '${emojis.cross}'
    }
    async function testPortForward(){
        await testPort(80)
        await testPort(443)
    }
    async function testDomain(){
        debugger
    }
    function saveDomain(e){
        debugger
    }
</script>
</head>

<body>
<h1>Initialize template server</h1>
<div><span>Local ip is: </span><code>${localIp}</code></div>
<div><span>Public ip is: </span><code>${publicIp}</code></div>
<h2>Step 1: Forward port 80 and 443</h2>
<div>
<div>Forward port 80 and 443 to ${localIp} in your router's settings.</div>
<div>Port 80 forwarded: <span id="test80">${emojis.question}</span></div>
<div>Port 443 forwarded: <span id="test443">${emojis.question}</span></div>
<button onclick="testPortForward()">Test port forwarding</button>
<h2>Step 2: Configure domain</h2>
<div>Configure a domain name with wildcard subdomains to point to <code>${publicIp}</code></div>
<div>A free domain can be obtained at <a href="https://www.duckdns.org/">DuckDns</a></div>
<div>Your domain name (without http/s):</div>
<input id="domain-input" oninput="saveDomain(event)">
<button onclick="testDomain()">Test domain</button>
</div>
</body>

</html>`
}
