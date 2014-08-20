#!/usr/bin/env python

# Copyright 2014 Ralph Giles. GPLv3 or later.

# Quick parser for spacecraft clock calibration

import sys

class Frame:
  def __init__(self, timestamp, buffer, station='unknown'):
    self.valid = False
    self.timestamp = timestamp
    self.buffer = buffer
    self.station = station
    frame_number = buffer[60]
    if (frame_number & 3 == 0):
      self.sclk = buffer[61] << 16 | buffer[62] << 8 | buffer[63]
      self.valid = True
  def __str__(self):
    data = map(str, [self.timestamp, self.sclk, self.station])
    return '\t'.join(data)

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
    frame = Frame(timestamp, buffer, station)
    if frame.valid:
      print(str(frame))
