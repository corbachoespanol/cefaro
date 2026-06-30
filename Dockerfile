FROM httpd:2.4-alpine

# Enable mod_headers and mod_deflate, allow .htaccess overrides
RUN sed -i \
    -e 's/#LoadModule headers_module/LoadModule headers_module/' \
    -e 's/#LoadModule deflate_module/LoadModule deflate_module/' \
    -e 's/#LoadModule rewrite_module/LoadModule rewrite_module/' \
    /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/AllowOverride None/AllowOverride All/g' /usr/local/apache2/conf/httpd.conf

# Copy all static website files
COPY ./ /usr/local/apache2/htdocs/

# Expose port 80 (Apache default)
EXPOSE 80
