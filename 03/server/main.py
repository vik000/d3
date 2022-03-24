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

async def world_cup_winners(request):
    r = {'Brazil': 5, 'Germany': 4, 'Italy': 4, 'Uruguay': 2, 'Argentina': 2, 'France': 2, 'England': 1, 'Spain': "1"}
    print('World Cup Winners')
    return web.Response(text=json.dumps(r), headers={"X-Custom-Server-Header": "Custom data"}, status=200)

async def random_stocks(request):
    msft = round(random.randrange(218, 220) + random.random(), 2)
    aapl = round(random.randrange(124, 127) + random.random(), 2)
    amzn = round(random.randrange(3190, 3220) + random.random(), 2)
    goog = round(random.randrange(1705, 1750) + random.random(), 2)
    fb = round(random.randrange(272, 279) + random.random(), 2)
    intc = round(random.randrange(43, 49) + random.random(), 2)
    csco = round(random.randrange(43, 51) + random.random(), 2)
    tsla = round(random.randrange(690, 713) + random.random(), 2)
    r = {'MSFT': msft, 'AAPL': aapl, 'AMZN': amzn, 'GOOG': goog, 'FB': fb, 'INTC': intc, 'CSCO': csco, 'TSLA': tsla}
    print('Stock values retrieved')
    return web.Response(text=json.dumps(r), headers={"X-Custom-Server-Header": "Custom data"}, status=200)



app = web.Application()
cors = aiohttp_cors.setup(app)

app.router.add_route("GET", "/", handle)
app.router.add_route("GET", "/world-cup-winners", world_cup_winners)
app.router.add_route("GET", "/random-stocks", random_stocks)


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
