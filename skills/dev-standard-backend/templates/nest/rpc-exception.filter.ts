import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const rpcError = exception.getError();

    if (rpcError.toString().includes('Empty response.')) {
      return response.status(500).json({
        message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1),
        status: 500,
      });
    }

    if (typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError) {
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;

      return response.status(status).json(rpcError);
    }

    return response.status(400).json({ message: rpcError, status: 400 });
  }
}
