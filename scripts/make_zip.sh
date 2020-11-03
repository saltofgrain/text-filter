rm -r dist/*
pushd src
zip -r ../dist/log-viewer.zip *
popd
unzip dist/log-viewer.zip -d dist/log-viewer