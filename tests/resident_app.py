import websocket
from operator_app import operator_main

token = None

def on_message(ws, message):
	global token
	cmd, arg = message.split("::")
	if cmd == "token":
		token = arg
		operator_main(token)
	elif cmd == "address_data":
		ws.send(token + "::confirm_resident")
		print("Test passed ")
		ws.close()


def on_error(ws, error):
	print(error)

def on_close(ws, close_status_code, close_msg):
	print("### closed ###")

def on_open(ws):
	ws.send('new_resident::012345678987')

def resident_main():
	ws = websocket.WebSocketApp("ws://localhost:5556/",
							  on_open=on_open,
							  on_message=on_message,
							  on_error=on_error,
							  on_close=on_close)

	ws.run_forever()

if __name__ == "__main__":
	resident_main()