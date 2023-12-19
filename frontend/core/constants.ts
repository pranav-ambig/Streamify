import { io } from 'socket.io-client'

export const SERVER_BASE_URL = 'http://localhost:5052'
export const ICE_CONFIG = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
export const socket = io(SERVER_BASE_URL, {autoConnect: false});