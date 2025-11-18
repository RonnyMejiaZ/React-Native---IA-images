from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

LEXICA_API_URL = "https://lexica.art/api/infinite-prompts"

FULL_COOKIE_STRING = (
    "__Secure-next-auth.callback-url=https%3A%2F%2Flexica.art; "
    "__Host-next-auth.csrf-token=94e05b3932545d9fb0b47502454aca7a270030113fa755d8b4d8c9852ccf1f70%7C530bf23f6f3d6aaaa15d2f8fc0c90ba90aa7daf47fe5872d3d26b3beb91a9125; "
    "__Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..jMCT-KywwWgtiJb-.QD-5LlW-jBVnZqrzmMRAgDmYuXIgruU6wHOKGYoBDZVoKxJwLmLA5UzZ7Z4hP1btnzn_1DDv3QOwIym4TRz1xNjlI5vR6UwMO4QPTUh-A2HNrg5jOf99tand1i1fdbsNqUlceet-NRrWAquJ4TiF1UZk3In2A2u4zdm7_Da0b8D91lPM_5kIE7noy_XMep_lWcNwK13snCi8npicvgtqGB_ekrYyPitKMO-ROcaQ8eXHeetTZjTdE9JtDK7I_qqYJNMFumu93gytOf43-2rbCobPrYs0Tj5wA5lMVwKm2_j0ih6n3Uamn93YgmSBDWaOGsHHRDxnVb6DmRju928i0349oxZWmqZapiunsflSKJ3DPnV0bQWrvVlbpnibz-JqwO2Dh-gQjUrEzGQ869E8i53gInmvTNo.h78GWqRhWFYzb1bFrlO_bA"
)

@app.route("/api/lexica-proxy", methods=["POST", "GET"])
def lexica_proxy():
    try:
        if request.method == "POST":
            data = request.get_json()
            search_query = data.get("q", "")
            page = data.get("page", 1)
            per_page = data.get("per_page", 10)
        else:
            search_query = request.args.get("q", "")
            page = int(request.args.get("page", 1))
            per_page = int(request.args.get("per_page", 10))

        if not search_query:
            return jsonify({"error": "El parámetro 'q' (searchQuery) es requerido"}), 400

        payload = {
            "q": search_query,
            "page": page,
            "per_page": per_page,
        }

        headers = {
            "Content-Type": "application/json",
            "Cookie": FULL_COOKIE_STRING,
            "Referer": "https://lexica.art/",
            "Accept": "application/json, text/plain, */*",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
        }

        response = requests.post(LEXICA_API_URL, json=payload, headers=headers, timeout=30)

        if response.status_code == 401:
            return jsonify({"error": "401 No Autorizado. La Cookie de sesión ha caducado."}), 401

        if not response.ok:
            return (
                jsonify(
                    {
                        "error": f"Error en la petición a Lexica: {response.status_code} - {response.text}"
                    }
                ),
                response.status_code,
            )

        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Error al contactar con la API de Lexica: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Proxy server is running"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

