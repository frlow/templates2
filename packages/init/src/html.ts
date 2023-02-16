import { getLocalIp } from './ip'

export const getPage = () => `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Initialize template server</title>
</head>

<body>
<h1>Initialize template server</h1>
<h2>Step 1: Forward port 80 and 443</h2>
<div>
<span>Local ip is: </span><code>${getLocalIp()}</code>

</div>
</body>

</html>`
