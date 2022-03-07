from aiohttp import web
import asyncio
import aiohttp_cors
import json
import sys
import random


# HANDLERS:
async def handle(request):
    text = {'status': 'ok'}
    print('received request for "{}".'.format(text))
    return web.Response(text=json.dumps(text), headers={"X-Custom-Server-Header": "Custom data"}, status=200)

async def random_rolls(request):
    print("Received request")
    body = await request.json()
    number_of_rolls = int(body.get("rolls"))
    dice = body.get("dice") or 2
    rolls = []
    for r in range(number_of_rolls):
        rolls.append(sum(random.randint(1, 6) for d in range(dice)))
    r = {"rolls": sorted(rolls)}
    return web.Response(text=json.dumps(r), headers={"X-Custom-Server-Header": "Custom data"}, status=200)



app = web.Application()
cors = aiohttp_cors.setup(app)

app.router.add_route("GET", "/", handle)
app.router.add_route("POST", "/random-rolls", random_rolls)


cors = aiohttp_cors.setup(app, defaults={
    "*": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers="*",
        allow_headers="*",
    )
})

for route in list(app.router.routes()):
    cors.add(route)


if __name__ == "__main__":
    web.run_app(app, port=8000)

