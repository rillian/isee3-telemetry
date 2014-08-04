#!/usr/bin/env python
# -*- coding: utf-8 -*-
# vim: noet ci pi sts=0 sw=4 ts=4 :
#
#  constants.py
#  
#  Copyright 2014 Balint Seeber <balint256@gmail.com>
#  
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#  
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#  
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#  
#  

MINOR_FRAME_LEN = 128
NUM_MINOR_FRAMES = 256

MINOR_FRAME_KEY= 'MIF'
DIGITAL_SUBCOM = 'DS'
ANALOG_SUBCOM_1= 'AS1'
ANALOG_SUBCOM_2= 'AS2'

EMF_SUBCOM_LEN = 64

EMF_COLS = {
	DIGITAL_SUBCOM:	(EMF_SUBCOM_LEN, [20, 21, 22, 23, 44, 45, 46, 47, 59, 68, 69, 70, 71, 92, 93, 94, 95]),
	ANALOG_SUBCOM_1:(EMF_SUBCOM_LEN, [17, 33, 36, 49, 52, 65, 75, 81, 84, 91, 97, 100, 107, 113, 116]),
	ANALOG_SUBCOM_2:(EMF_SUBCOM_LEN, [19, 25, 35, 38, 41, 51, 54, 57, 67, 73, 83, 89, 99, 105, 115, 121]),
}

SCI_COLS = {
	DIGITAL_SUBCOM:	(EMF_SUBCOM_LEN, [59]),
	ANALOG_SUBCOM_1:(EMF_SUBCOM_LEN, [58]),
	ANALOG_SUBCOM_2:(EMF_SUBCOM_LEN, [122]),
	# Any other science/experiment subcoms go here
}

MODE_ENG = 'engineering'
MODE_SCI = 'science'

MODE_MAP = {
	MODE_ENG:	EMF_COLS,
	MODE_SCI:	SCI_COLS
}

MINOR_FRAME_IDX_OFFSET = 60

EVENT_NEW_BYTE = 'new_byte'
EVENT_NEW_FRAME= 'new_frame'

def main():
	return 0

if __name__ == '__main__':
	main()
