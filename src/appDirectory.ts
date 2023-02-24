import {AppDirectory} from "~/docker/AppDirectory";
export const appDirectory: AppDirectory = {
  "deluge": {
    "services": {
      "deluge": {
        "image": "lscr.io/linuxserver/deluge",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/Stockholm"
        ],
        "volumes": [
          "deluge:/config",
          "media:/data"
        ]
      }
    },
    "ingresses": {
      "deluge": 8112
    }
  },
  "demo": {
    "services": {
      "demo": {
        "image": "nginxdemos/nginx-hello"
      }
    },
    "ingresses": {
      "demo": 8080
    },
    "description": "An nginx demo app"
  },
  "duplicati": {
    "services": {
      "duplicato": {
        "image": "lscr.io/linuxserver/duplicati",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/London"
        ],
        "volumes": [
          "duplicati_config:/config",
          "duplicati_backups:/backups",
          "duplicati_source:/source",
          "media:/data"
        ]
      }
    },
    "ingresses": {
      "duplicati": 8200
    }
  },
  "flood": {
    "serivices": {
      "flood": {
        "image": "jesec/flood",
        "volumes": [
          "flood:/config"
        ],
        "environment": [
          "FLOOD_OPTION_rundir=/config"
        ],
        "user": "root"
      }
    },
    "ingresses": {
      "flood": 3000
    },
    "description": "# Flood\nFlood is a monitoring service for various torrent clients. It's a Node.js service that communicates with your favorite torrent client and serves a decent web UI for administration. Flood-UI organization hosts related projects.\n```\nuse the following urls when connecting clients: \ntransmission: http://transmission:9091/transmission/rpc\n```\n"
  },
  "plex": {
    "services": {
      "plex": {
        "image": "lscr.io/linuxserver/plex",
        "network_mode": "host",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "VERSION=docker"
        ],
        "volumes": [
          "plex:/config",
          "media:/data"
        ]
      }
    }
  },
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
    "ingresses": {
      "radarr": 7878
    },
    "description": "Movie download automation"
  },
  "sonarr": {
    "services": {
      "sonarr": {
        "image": "lscr.io/linuxserver/sonarr",
        "volumes": [
          "sonarr:/config",
          "media:/data"
        ],
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/Stockholm"
        ]
      }
    },
    "ingresses": {
      "sonarr": 8989
    }
  }
}