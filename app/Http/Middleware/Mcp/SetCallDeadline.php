<?php

declare(strict_types=1);

namespace App\Http\Middleware\Mcp;

use App\Agents\Contracts\AgentCallContext;
use App\Agents\Exceptions\AgentContextMissing;
use App\Bus\Enums\RefusalCode;
use App\Bus\Support\OperationDeadline;
use App\Mcp\Data\JsonRpcIdData;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Container\Container;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gives an MCP call its deadline from the signed issue time: at most 15 seconds from entry and never past 19 seconds
 * after the agent issued it, so every lock wait and statement of the call shares what is left. A call already past
 * its deadline is refused before anything runs. The request's deadline replaces the default only for this request.
 * It reads the agent context when it handles the call, never when it is built: the kernel builds every route
 * middleware again after the response, when the context is gone.
 */
final readonly class SetCallDeadline
{
    private const int ENTRY_MILLISECONDS = 15_000;

    private const int SIGNED_MILLISECONDS = 19_000;

    private const int SERVER_ERROR = -32000;

    public function __construct(private Container $container, private AgentCallContext $calls) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $issuedAt = $this->calls->context()->getOrThrow(AgentContextMissing::forRequest())->call->issuedAt;

        $signedLeft = (int) CarbonImmutable::now()->diffInMilliseconds(
            $issuedAt->addMilliseconds(self::SIGNED_MILLISECONDS),
            false,
        );

        $deadline = new OperationDeadline(min(self::ENTRY_MILLISECONDS, $signedLeft));

        if ($deadline->hasRunOut()) {
            return $this->expired($request);
        }

        $default = $this->container->make(OperationDeadline::class);
        $this->container->instance(OperationDeadline::class, $deadline);

        try {
            return $next($request);
        } finally {
            $this->container->instance(OperationDeadline::class, $default);
        }
    }

    private function expired(Request $request): JsonResponse
    {
        return new JsonResponse([
            'jsonrpc' => '2.0',
            'id' => JsonRpcIdData::idIn($request->getContent()),
            'error' => [
                'code' => self::SERVER_ERROR,
                'message' => 'The call reached the journal after its deadline and was not run; send it again.',
                'data' => [
                    'code' => RefusalCode::DeadlineExpired->value,
                    'retryable' => RefusalCode::DeadlineExpired->isRetryable(),
                ],
            ],
        ], Response::HTTP_REQUEST_TIMEOUT);
    }
}
