import sys
import traceback

sys.path.append('api')
try:
    import index
    print('SUCCESS')
except Exception as e:
    print('FAILED TO START Uvicorn APP')
    traceback.print_exc()
