<?php

declare(strict_types=1);

namespace App\Mcp\Providers;

use App\Agents\Support\AgentContext;
use Illuminate\Cache\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;

/**
 * Serves the journal's MCP server on its signed route, and limits each agent session to 120 calls a minute.
 */
final class McpServiceProvider extends ServiceProvider
{
    private const int CALLS_PER_MINUTE = 120;

    public function boot(RateLimiter $limiter): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/mcp.php');

        $limiter->for('journal-mcp', fn (Request $request): Limit => Limit::perMinute(self::CALLS_PER_MINUTE)
            ->by($this->app->make(AgentContext::class)->sessionId)
            ->response(fn (Request $request, array $headers): JsonResponse => new JsonResponse(
                ['message' => 'Too many calls.', 'retry_after_seconds' => (int) ($headers['Retry-After'] ?? 0)],
                JsonResponse::HTTP_TOO_MANY_REQUESTS,
                $headers,
            )));
    }
}
