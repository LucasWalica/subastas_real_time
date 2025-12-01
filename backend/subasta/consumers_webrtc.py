# auctions/consumers_webrtc.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class AuctionWebRTCConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.auction_id = self.scope['url_route']['kwargs']['auction_id']
        self.group_name = f"webrtc_{self.auction_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get("action")
        payload = data.get("payload")

        # Reenviar a todos los clientes
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "webrtc_signal",
                "action": action,
                "payload": payload,
                "sender": self.channel_name
            }
        )

    async def webrtc_signal(self, event):
        # Evitar enviárselo al mismo cliente que lo envió
        if event["sender"] == self.channel_name:
            return
        await self.send(text_data=json.dumps({
            "action": event["action"],
            "payload": event["payload"]
        }))
