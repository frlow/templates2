FILES=$(ls -a | grep .png | sort)
for f in $FILES
do
	echo "Processing $f"
	convert $f -resize 60x600\> $f
done