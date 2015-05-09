#!/bin/sh

cjb
RETVAL=$?

if [ ${RETVAL} -ne 0 ]
then
  exit 1
fi
