<?php

declare(strict_types=1);

namespace App\Http\Middleware\Mcp;

use App\Agents\Support\AgentContext;
use App\Bus\Enums\RefusalCode;
use App\Bus\Support\OperationDeadline;
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
 */
final readonly class SetCallDeadline
{
    private const int ENTRY_MILLISECONDS = 15_000;

    private const int SIGNED_MILLISECONDS = 19_000;

    private const int SERVER_ERROR = -32000;

    public function __construct(private Container $container, private AgentContext $agent) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $now = CarbonImmutable::now();
        $signedLeft = (int) $now->diffInMilliseconds($this->agent->call->issuedAt->addMilliseconds(self::SIGNED_MILLISECONDS), false);
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
        $frame = json_decode($request->getContent(), true);
        $id = is_array($frame) ? ($frame['id'] ?? null) : null;

        return new JsonResponse([
            'jsonrpc' => '2.0',
            'id' => is_int($id) || is_string($id) ? $id : null,
            'error' => [
                'code' => self::SERVER_ERROR,
                'message' => 'The call reached the journal after its deadline and was not run; send it again.',
                'data' => ['code' => RefusalCode::DeadlineExpired->value, 'retryable' => RefusalCode::DeadlineExpired->isRetryable()],
            ],
        ], Response::HTTP_REQUEST_TIMEOUT);
    }
}
