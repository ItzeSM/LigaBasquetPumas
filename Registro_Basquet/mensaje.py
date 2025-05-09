from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime
from supabase import create_client, Client
import requests

app = Flask(__name__)
CORS(app, resources={r"/enviar-recordatorios": {"origins": "*"}})

# ⚙️ Configura tus credenciales reales
SUPABASE_URL = 'https://etvwqfxefzvdztxndptn.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0dndxZnhlZnp2ZHp0eG5kcHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDk2MjYsImV4cCI6MjA2MDUyNTYyNn0.2fmsHn64AQPmTTww1i_fT_iPLPU6HwWMzGeJKbnJ_iM'
ULTRAMSG_INSTANCE = "instance119015"
ULTRAMSG_TOKEN = "j9466zwz9w9tm1c4"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def enviar_whatsapp(nombre, telefono, monto):
    url = f"https://api.ultramsg.com/{ULTRAMSG_INSTANCE}/messages/chat"
    payload = {
        "token": ULTRAMSG_TOKEN,
        "to": f"+52{telefono}",
        "body": f"Hola {nombre}, te recordamos que tienes un pago pendiente de ${monto:.2f} para el club de básquetbol. ¡Gracias!"
    }
    response = requests.post(url, data=payload)
    return response.status_code == 200

@app.route('/enviar-recordatorios', methods=['GET'])
def enviar_recordatorios():
    hoy = datetime.now().day
    if not (1 <= hoy <= 5 or 15 <= hoy <= 20):
        return jsonify({"mensaje": "Hoy no es un día válido para enviar recordatorios."}), 403

    pagos = supabase.table("pagos").select("*").eq("estado_pago", "pendiente").execute().data
    enviados = []

    for pago in pagos:
        inscripcion_id = pago.get("inscripcion_id")
        if not inscripcion_id:
            continue

        inscripcion = supabase.table("inscripciones") \
            .select("nombre, apellido_paterno, telefono") \
            .eq("id", inscripcion_id).single().execute().data

        if inscripcion:
            nombre = f"{inscripcion['nombre']} {inscripcion['apellido_paterno']}"
            telefono = inscripcion['telefono']
            monto = pago['monto']

            if enviar_whatsapp(nombre, telefono, monto):
                enviados.append(nombre)

    return jsonify({"recordatorios_enviados": enviados})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
