import {AppDirectory} from "~/docker/AppDirectory";
export const appDirectory: AppDirectory = {
  "radarr": {
    "services": {
      "radarr": {
        "image": "lscr.io/linuxserver/radarr",
        "volumes": [
          "radarr:/config",
          "media:/data"
        ],
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/Stockholm"
        ]
      }
    },
    "ingresses": [
      "radarr:7878"
    ],
    "description": "A music streaming server"
  }
}