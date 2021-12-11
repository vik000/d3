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

async def random_stocks(request):
    msft = round(random.randrange(218, 220) + random.random(), 2)
    aapl = round(random.randrange(124, 127) + random.random(), 2)
    amzn = round(random.randrange(3190, 3220) + random.random(), 2)
    goog = round(random.randrange(1705, 1750) + random.random(), 2)
    fb = round(random.randrange(272, 279) + random.random(), 2)
    intc = round(random.randrange(43, 49) + random.random(), 2)
    csco = round(random.randrange(43, 51) + random.random(), 2)
    tsla = round(random.randrange(690, 713) + random.random(), 2)
    r = {'MSFT': msft(), 'AAPL': aapl(), 'AMZN': amzn(), 'GOOG': goog(), 'FB': fb(), 'INTC': intc(), 'CSCO': csco(), 'TSLA': tsla()}
    print('Stock values retrieved')
    return web.Response(text=json.dumps(r), headers={"X-Custom-Server-Header": "Custom data"}, status=200)

async def get_bubbles(request):
    r = {0: []}
    for bubble in range(random.choice(list(range(6, 20)))):
        ranx = round(random.randrange(0, 2220) + random.random(), 2)
        rany = round(random.randrange(1190, 3220) + random.random(), 2)
        ranz = round(random.randrange(100, 713) + random.random(), 2)
        category = random.choice(["A", "B", "C", "D"])
        r[0].append({'position': ranx, 'cost': rany, 'size': ranz, 'category': category})
    print('Use your bubbles!')
    return web.Response(text=json.dumps(r), headers={"X-Custom-Server-Header": "Custom data"}, status=200)


app = web.Application()
cors = aiohttp_cors.setup(app)

app.router.add_route("GET", "/", handle)
app.router.add_route("GET", "/random-stocks", random_stocks)
app.router.add_route("GET", "/bubbles", get_bubbles)


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
