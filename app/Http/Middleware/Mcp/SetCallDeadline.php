<?php

declare(strict_types=1);

namespace App\Http\Middleware\Mcp;

use App\Engine\Enums\RefusalCode;
use App\Mcp\Data\JsonRpcIdData;
use App\Sessions\Contracts\AgentCallContext;
use App\Sessions\Exceptions\AgentContextMissing;
use App\Support\StackOperationDeadline;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Container\Container;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gives an MCP call its deadline: at most 15 seconds from entry and 19 seconds from when the agent signed it, shared by
 * every lock wait and statement; a call already past it is refused. It reads the agent context when it handles the
 * call, since the kernel builds route middleware again after the response.
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

        $deadline = new StackOperationDeadline(min(self::ENTRY_MILLISECONDS, $signedLeft));

        if ($deadline->hasRunOut()) {
            return $this->expired($request);
        }

        $default = $this->container->make(StackOperationDeadline::class);
        $this->container->instance(StackOperationDeadline::class, $deadline);

        try {
            return $next($request);
        } finally {
            $this->container->instance(StackOperationDeadline::class, $default);
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
