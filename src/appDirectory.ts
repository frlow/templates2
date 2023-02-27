import {AppDirectory} from "~/docker/AppDirectory";
export const appDirectory: AppDirectory = {
  "code-server": {
    "services": {
      "code-server": {
        "image": "lscr.io/linuxserver/code-server",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/Stockholm",
          "SUDO_PASSWORD={{password}}",
          "PASSWORD={{password}}"
        ],
        "volumes": [
          "code-server:/config"
        ]
      }
    },
    "ingresses": {
      "code-server": -8443
    }
  },
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
  "duckdns": {
    "services": {
      "duckdns": {
        "image": "lscr.io/linuxserver/duckdns",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/London",
          "SUBDOMAINS={{domain}}",
          "TOKEN={{token}}",
          "LOG_FILE=false"
        ],
        "volumes": [
          "duckdns:/config"
        ]
      }
    },
    "variables": [
      "token"
    ]
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
  "emulatorjs": {
    "services": {
      "emulatorjs": {
        "image": "lscr.io/linuxserver/emulatorjs",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/London"
        ],
        "volumes": [
          "emulatorjs:/config",
          "emulatorjs-data:/data"
        ]
      }
    },
    "ingresses": {
      "emulatorjs-admin": 3000,
      "emulatorjs": 80
    },
    "description": "# EmulatorJs\nSelf-hosted Javascript emulation for various system.\n"
  },
  "flood": {
    "services": {
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
  "gitea": {
    "services": {
      "gitea": {
        "image": "gitea/gitea",
        "volumes": [
          "gitea:/data",
          "/etc/timezone:/etc/timezone:ro",
          "/etc/localtime:/etc/localtime:ro"
        ],
        "environment": [
          "USER_UID=1000",
          "USER_GID=1000"
        ]
      }
    },
    "ingresses": {
      "gitea": -3000
    }
  },
  "guacamole": {
    "services": {
      "guacamole": {
        "image": "maxwaldorf/guacamole",
        "volumes": [
          "guacamole:/config"
        ]
      }
    },
    "ingresses": {
      "guacamole": 8080
    }
  },
  "heimdall": {
    "services": {
      "heimdall": {
        "image": "lscr.io/linuxserver/heimdall",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/London"
        ],
        "volumes": [
          "heimdall:/config"
        ]
      }
    },
    "ingresses": {
      "heimdall": 80
    }
  },
  "homeassistant": {
    "services": {
      "homeassistant": {
        "image": "lscr.io/linuxserver/homeassistant",
        "network_mode": "host",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/London"
        ],
        "volumes": [
          "homeassistant:/config"
        ]
      }
    },
    "ingresses": {
      "homeassistant": 8123
    }
  },
  "jackett": {
    "services": {
      "jackett": {
        "image": "lscr.io/linuxserver/jackett",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/Stockholm"
        ],
        "volumes": [
          "jackett:/config"
        ]
      }
    },
    "ingresses": {
      "jackett": 9117
    }
  },
  "jellyfin": {
    "services": {
      "jellyfin": {
        "image": "lscr.io/linuxserver/jellyfin",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/London"
        ],
        "volumes": [
          "jellyfin:/config",
          "media:/data",
          "/opt/vc/lib:/opt/vc/lib"
        ],
        "devices": [
          "/dev/vchiq:/dev/vchiq",
          "/dev/video10:/dev/video10",
          "/dev/video11:/dev/video11",
          "/dev/video12:/dev/video12"
        ],
        "ports": [
          "7359:7359/udp",
          "1900:1900/udp"
        ]
      }
    },
    "ingresses": {
      "jellyfin": -8096
    }
  },
  "keycloak": {
    "services": {
      "keycloak": {
        "image": "quay.io/keycloak/keycloak",
        "environment": [
          "KEYCLOAK_ADMIN={{username}}",
          "KEYCLOAK_ADMIN_PASSWORD={{password}}"
        ],
        "command": "start-dev",
        "volumes": [
          "keycloak:/opt/keycloak/data"
        ]
      }
    },
    "ingresses": {
      "keycloak": 8080
    }
  },
  "lidarr": {
    "services": {
      "lidarr": {
        "image": "lscr.io/linuxserver/lidarr",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/London"
        ],
        "volumes": [
          "lidarr:/config",
          "media:/data"
        ]
      }
    },
    "ingresses": {
      "lidarr": 8686
    }
  },
  "miniserve": {
    "services": {
      "miniserve": {
        "image": "docker.io/svenstaro/miniserve",
        "volumes": [
          "media:/data"
        ],
        "command": [
          "/data"
        ]
      }
    },
    "ingresses": {
      "miniserve": 8080
    }
  },
  "nextcloud": {
    "services": {
      "nextcloud": {
        "image": "lscr.io/linuxserver/nextcloud",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/Stockholm"
        ],
        "volumes": [
          "nextcloud:/config",
          "nextcloud-data:/data"
        ]
      }
    },
    "ingresses": {
      "nextcloud": {
        "port": 443,
        "protocol": "https"
      }
    }
  },
  "nodered": {
    "services": {
      "nodered": {
        "image": "nodered/node-red",
        "volumes": [
          "nodered:/data"
        ]
      }
    },
    "ingresses": {
      "nodered": 1880
    },
    "description": "# Node Red\nThis application has a known issue where restoring backups breaks the application\n"
  },
  "nzbget": {
    "services": {
      "nzbget": {
        "image": "lscr.io/linuxserver/nzbget",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/Stockholm",
          "NZBGET_USER={{username}}",
          "NZBGET_PASS={{password}}"
        ],
        "volumes": [
          "nzbget:/config",
          "media:/data"
        ]
      }
    },
    "ingresses": {
      "nzbget": 6789
    }
  },
  "ombi": {
    "services": {
      "ombi": {
        "image": "lscr.io/linuxserver/ombi",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/Stockholm"
        ],
        "volumes": [
          "ombi:/config"
        ]
      }
    },
    "ingresses": {
      "ombi": -3579
    }
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
  "pocketbase": {
    "services": {
      "compose": {
        "image": "ghcr.io/muchobien/pocketbase:latest",
        "volumes": [
          "pocketbase:/pb_data"
        ]
      }
    },
    "ingresses": {
      "pocketbase": -8090
    }
  },
  "portainer": {
    "services": {
      "portainer": {
        "image": "cr.portainer.io/portainer/portainer-ce",
        "volumes": [
          "/var/run/docker.sock:/var/run/docker.sock",
          "portainer:/data"
        ]
      }
    },
    "ingresses": {
      "portainer": 9000
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
  "readarr": {
    "services": {
      "readarr": {
        "image": "lscr.io/linuxserver/readarr:develop",
        "volumes": [
          "readarr:/config",
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
      "readarr": 8787
    }
  },
  "rutorrent": {
    "services": {
      "rutorrent": {
        "image": "ghcr.io/linuxserver/rutorrent",
        "environment": [
          "PUID=1000",
          "PGID=1000"
        ],
        "volumes": [
          "rutorrent:/config",
          "media:/data"
        ]
      }
    },
    "ingresses": {
      "rutorrent": 80
    }
  },
  "sabnzbd": {
    "services": {
      "sabnzbd": {
        "image": "lscr.io/linuxserver/sabnzbd",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/London"
        ],
        "volumes": [
          "sabnzbd:/config",
          "media:/data"
        ]
      }
    },
    "ingresses": {
      "sabnzbd": 8080
    }
  },
  "samba": {
    "services": {
      "samba": {
        "image": "dperson/samba",
        "environment": [
          "USERID=1000",
          "GROUPID=1000",
          "TZ=Europe/Stockholm"
        ],
        "command": "-u \"{{username}};{{password}}\" -s \"files;/data;yes;no;no\"",
        "ports": [
          "139:139",
          "445:445"
        ],
        "volumes": [
          "media:/data"
        ]
      }
    },
    "description": "# Samba server (smb)\nThe server is available at\n```\n//<user>@<ip or domain>/files\n```\n"
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
  },
  "tautulli": {
    "services": {
      "tautulli": {
        "image": "lscr.io/linuxserver/tautulli",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/London"
        ],
        "volumes": [
          "tautulli:/config"
        ]
      }
    },
    "ingresses": {
      "tautulli": 8181
    }
  },
  "transmission": {
    "services": {
      "transmission": {
        "image": "lscr.io/linuxserver/transmission",
        "environment": [
          "PUID=1000",
          "PGID=1000",
          "TZ=Europe/Stockholm",
          "USER={{username}}",
          "PASS={{password}}"
        ],
        "volumes": [
          "transmission:/config",
          "media:/data"
        ]
      }
    },
    "ingresses": {
      "transmission": 9091
    }
  },
  "unifi-controller": {
    "services": {
      "unifi": {
        "image": "lscr.io/linuxserver/unifi-controller",
        "environment": [
          "PUID=1000",
          "PGID=1000"
        ],
        "volumes": [
          "unifi:/config"
        ],
        "ports": [
          "3478:3478/udp",
          "10001:10001/udp",
          "8080:8080"
        ]
      }
    },
    "ingresses": {
      "unifi": {
        "port": 8443,
        "protocol": "https"
      }
    }
  }
}