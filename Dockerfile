FROM httpd:2.4-alpine

# Copy static website files into Apache's document root
COPY ./index.html /usr/local/apache2/htdocs/
COPY ./style.css /usr/local/apache2/htdocs/
COPY ./script.js /usr/local/apache2/htdocs/

# Expose port 80 (Apache default)
EXPOSE 80
