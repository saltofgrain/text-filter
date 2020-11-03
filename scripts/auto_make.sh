while inotifywait -r . -e modify; do 
    ./scripts/make_zip.sh; 
done 
