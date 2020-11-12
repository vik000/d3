from aiohttp import web
import asyncio
import aiohttp_cors
import json
import sys


# HANDLERS:
async def handle(request):
    text = {'status': 'ok'}
    print('received request for "{}".'.format(text))
    return web.Response(text=json.dumps(text), headers={"X-Custom-Server-Header": "Custom data"}, status=200)

async def world_cup_winners(request):
    r = {'Brazil': 5, 'Germany': 4, 'Italy': 4, 'Uruguay': 2, 'Argentina': 2, 'France': 2, 'England': 1, 'Spain': 1}
    print('World Cup Winners')
    return web.Response(text=json.dumps(r), headers={"X-Custom-Server-Header": "Custom data"}, status=200)



app = web.Application()
cors = aiohttp_cors.setup(app)

app.router.add_route("GET", "/", handle)
app.router.add_route("GET", "/world-cup-winners", world_cup_winners)


cors = aiohttp_cors.setup(app, defaults={
    "*": aiohttp_cors.ResourceOptions(
        allow_credentials=True,
        expose_headers="*",
        allow_headers="*",
    )
})

for route in list(app.router.routes()):
    cors.add(route)

web.run_app(app, port=8000)
