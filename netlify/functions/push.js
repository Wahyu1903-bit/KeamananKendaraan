const https = require("https");

exports.handler = async function (event, context) {
  const params = event.queryStringParameters;
  const status = params.status;

  // Validasi status
  if (status !== "Waspada" && status !== "Bahaya") {
    return {
      statusCode: 400,
      body: "Status tidak valid. Gunakan ?status=Waspada atau ?status=Bahaya",
    };
  }

  // Set heading dan isi pesan sesuai status
  let message = "";
  if (status === "Waspada") {
    message = "Waspada, Kendaraan Anda Terdeteksi Pergerakan...!!!";
  } else if (status === "Bahaya") {
    message = "Bahaya, Segera Periksa Kendaraan Anda...!!!";
  }

  // Ganti dengan milikmu sendiri:
  const oneSignalAppId = "549045d7-915f-48e2-8799-5d6251a7b587";
  const oneSignalApiKey = "os_v2_app_ksielv4rl5eofb4zlvrfdj5vq4rkvtgln46ep7n6jiylz7glvy64xlq2xnbtulivbhzy6x6ncq6kknxefdjciw75dhsnj2pvhbikbhi";

  const data = JSON.stringify({
    app_id: oneSignalAppId,
    included_segments: ["All"],
    headings: { en: "⚠️PERINGATAN...❗❗" },
    contents: { en: message },
  });

  const options = {
    hostname: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Basic ${oneSignalApiKey}`,
      "Content-Length": Buffer.byteLength(data),
    },
  };

  // Kirim request ke OneSignal
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding("utf8");
      let responseBody = "";

      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        resolve({
          statusCode: 200,
          body: `Notifikasi ${status} berhasil dikirim!\n\nResponse:\n${responseBody}`,
        });
      });
    });

    req.on("error", (e) => {
      reject({
        statusCode: 500,
        body: `Gagal mengirim notifikasi: ${e.message}`,
      });
    });

    req.write(data);
    req.end();
  });
};
