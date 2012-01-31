url:=file:///`pwd`/../web/index.html 
output := img.png

clean:
	rm $(output)

create:
	casperjs charts.js $(url) $(output)

show:
	firefox $(url) $(output) > /dev/null 2> /dev/null &
