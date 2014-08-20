#!/usr/bin/env python

# Copyright 2014 Ralph Giles. GPLv3 or later.

# Quick parser for spacecraft clock calibration

import sys

for line in sys.stdin.readlines():
  words = line.split()
  if len(words) == 0:
    continue
  if words[0] == 'Frame':
    timestamp = words[5][1:-1];
    if (len(words) == 10):
      station = words[9]
    else:
      station = 'unknown'
    buffer = []
  else:
    for byte in words:
      buffer.append(int(byte, 16))
  if len(buffer) >= 128:
    frame_number = buffer[60]
    if (frame_number & 3 == 0):
      sclk = buffer[61] << 16 | buffer[62] << 8 | buffer[63]
    print('\t'.join(map(str, [timestamp, sclk, frame_number, station])))
