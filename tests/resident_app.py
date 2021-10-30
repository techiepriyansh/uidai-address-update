import websocket
from operator_app import operator_main

token = None
txn = None
dotenv_vars = {}

def on_message(ws, message):
	global token, txn
	cmd, arg = message.split("::")
	if cmd == "txn":
		txn = arg
		otp = input("OTP: ")
		ws.send(f'auth_otp_resident::{txn}::{otp}')
	elif cmd == "token":
		token = arg
		operator_main(token)
	elif cmd == "address_data":
		ws.send(token + "::confirm_resident")
		print("Test passed ")
		ws.close()
	elif cmd == "error":
		print(f"Error: {arg}")
		ws.close()


def on_error(ws, error):
	print(error)

def on_close(ws, close_status_code, close_msg):
	print("### closed ###")

def on_open(ws):
	ws.send(f'new_resident::{dotenv_vars["AADHAR_UID"]}')

def resident_main():
	parse_dotenv()
	print(dotenv_vars["AADHAR_UID"])
	ws = websocket.WebSocketApp("ws://localhost:5556/",
							  on_open=on_open,
							  on_message=on_message,
							  on_error=on_error,
							  on_close=on_close)

	ws.run_forever()

def parse_dotenv():
	dotenv_file_path = r".env"
	with open(dotenv_file_path, 'r') as f:
		arr = f.read().strip().split('\n')
		for el in arr:
			k,v = el.split("=")
			dotenv_vars[k] = v

if __name__ == "__main__":
	resident_main()