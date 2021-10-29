import websocket

token = None

def on_message(ws, message):
	global token
	cmd, arg = message.split("::")
	if cmd == "new_operator":
		assert arg == "true"
		ws.send(token + r'::authenticate_resident::{"name": "someone"}')
	elif cmd == "authenticate_resident":
		assert arg == "true"
		ws.send(token + r'::upload_address_data::{"orig": "177A Blecker Street", "new": "10880 Malibu"}')
	elif cmd == "upload_address_data":
		assert arg == "true"
		ws.close()

def on_error(ws, error):
	print(error)

def on_close(ws, close_status_code, close_msg):
	print("### closed ###")

def on_open(ws):
	global token
	ws.send(f'new_operator::{token}')

def operator_main(recvd_token):
	global token
	token = recvd_token
	ws = websocket.WebSocketApp("ws://localhost:5556/",
							  on_open=on_open,
							  on_message=on_message,
							  on_error=on_error,
							  on_close=on_close)

	ws.run_forever()