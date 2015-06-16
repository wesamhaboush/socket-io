#!/bin/bash +x

ab -n 2000 -c 10 http://localhost:8080/stream > stream.results
ab -n 2000 -c 10 http://localhost:8080/once > once.results
