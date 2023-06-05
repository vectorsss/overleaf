# ---------------------------------------------
# Overleaf Community Edition (overleaf/overleaf)
# ---------------------------------------------

ARG SHARELATEX_BASE_TAG=sharelatex/sharelatex-base:latest
FROM $SHARELATEX_BASE_TAG

WORKDIR /overleaf

# Add required source files
# -------------------------
ADD server-ce/genScript.js /overleaf/genScript.js
ADD server-ce/services.js /overleaf/services.js
ADD package.json package-lock.json /overleaf/
ADD libraries/ /overleaf/libraries/
ADD services/ /overleaf/services/

# Store the revision
# ------------------
ARG MONOREPO_REVISION
RUN echo "monorepo-server-ce,$MONOREPO_REVISION" > /var/www/revisions.txt

# Install npm dependencies
# ------------------------
ENV CYPRESS_INSTALL_BINARY=0

RUN export all_proxy=http://192.168.31.1:1070 && export https_proxy=http://192.168.31.1:1070 && export http_proxy=http://192.168.31.1:1070
RUN npm config set registry https://registry.npmmirror.com/ 
RUN node genScript install | bash

# Compile
# --------------------
# RUN cd /overleaf/services/web && npm run 'lezer-latex:generate'
RUN node genScript compile | bash

# Copy runit service startup scripts to its location
# --------------------------------------------------
ADD server-ce/runit /etc/service


# Configure nginx
# ---------------
ADD server-ce/nginx/nginx.conf.template /etc/nginx/templates/nginx.conf.template
ADD server-ce/nginx/sharelatex.conf /etc/nginx/sites-enabled/sharelatex.conf
ADD server-ce/nginx/clsi-nginx.conf /etc/nginx/sites-enabled/clsi-nginx.conf

# add truetype fonts
ADD develop/texlive/msttcorefonts /usr/share/fonts/truetype/msttcorefonts
RUN fc-cache

# add pyments
# RUN apt update && apt install python-pygments python3-pygments
# RUN echo "shell_escape = t" >> /usr/local/texlive/2022/texmf.cnf

# Configure log rotation
# ----------------------
ADD server-ce/logrotate/sharelatex /etc/logrotate.d/sharelatex
RUN chmod 644 /etc/logrotate.d/sharelatex

# Configure cron tasks
# ----------------------
ADD server-ce/cron /overleaf/cron
ADD server-ce/config/crontab-history /etc/cron.d/crontab-history
RUN chmod 600 /etc/cron.d/crontab-history
ADD server-ce/config/crontab-deletion /etc/cron.d/crontab-deletion
RUN chmod 600 /etc/cron.d/crontab-deletion

# Copy Phusion Image startup and shutdown scripts to their locations
# ------------------------------------------------------------------
COPY server-ce/init_scripts/ /etc/my_init.d/
COPY server-ce/init_preshutdown_scripts/ /etc/my_init.pre_shutdown.d/

# Copy app settings files
# -----------------------
COPY server-ce/config/settings.js /etc/sharelatex/settings.js

# Copy history-v1 files
# -----------------------
COPY server-ce/config/production.json /overleaf/services/history-v1/config/production.json
COPY server-ce/config/custom-environment-variables.json /overleaf/services/history-v1/config/custom-environment-variables.json

# Copy grunt thin wrapper
# -----------------------
ADD server-ce/bin/grunt /usr/local/bin/grunt
RUN chmod +x /usr/local/bin/grunt

# File that controls open|closed status of the site
# -------------------------------------------------
ENV SITE_MAINTENANCE_FILE "/etc/sharelatex/site_status"
RUN touch $SITE_MAINTENANCE_FILE

# Set Environment Variables
# --------------------------------
ENV SHARELATEX_CONFIG /etc/sharelatex/settings.js

ENV WEB_API_USER "sharelatex"
ENV ADMIN_PRIVILEGE_AVAILABLE "true"

ENV SHARELATEX_APP_NAME "Overleaf Community Edition"

ENV OPTIMISE_PDF "true"

ENV SHARELATEX_FPH_INITIALIZE_NEW_PROJECTS "true"
ENV SHARELATEX_FPH_DISPLAY_NEW_PROJECTS "true"

ENV SHARELATEX_HISTORY_BACKEND "fs"
ENV SHARELATEX_HISTORY_BLOBS_BUCKET "/var/lib/sharelatex/data/history/overleaf-blobs"
ENV SHARELATEX_HISTORY_PROJECT_BLOBS_BUCKET "/var/lib/sharelatex/data/history/overleaf-project-blobs"
ENV SHARELATEX_HISTORY_CHUNKS_BUCKET "/var/lib/sharelatex/data/history/overleaf-chunks"
ENV SHARELATEX_HISTORY_ZIPS_BUCKET "/var/lib/sharelatex/data/history/overleaf-zips"
ENV SHARELATEX_HISTORY_ANALYTICS_BUCKET "/var/lib/sharelatex/data/history/overleaf-analytics"
ENV PATH="/usr/local/texlive/2022/bin/x86_64-linux:${PATH}"
ENV SHARELATEX_SITE_LANGUAGE "zh-CN"

# Phusion Image timeouts before sending SIGKILL to processes
# ----------------------------------------------------------
ENV KILL_PROCESS_TIMEOUT 55
ENV KILL_ALL_PROCESSES_TIMEOUT 55

ENV NODE_ENV "production"
ENV LOG_LEVEL "info"


EXPOSE 80

ENTRYPOINT ["/sbin/my_init"]
