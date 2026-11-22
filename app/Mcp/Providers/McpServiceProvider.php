<?php

declare(strict_types=1);

namespace App\Mcp\Providers;

use App\Contracts\Domains\JournalToolNames;
use App\Mcp\Console\ContractSnapshotCommand;
use App\Mcp\Console\RelayCommand;
use App\Mcp\Contracts\Continuations as ContinuationsContract;
use App\Mcp\Contracts\JobPermissionReader as JobPermissionReaderContract;
use App\Mcp\Contracts\McpCall;
use App\Mcp\Contracts\NumberedPages;
use App\Mcp\Contracts\TextFields as TextFieldsContract;
use App\Mcp\Models\RetainedPage;
use App\Mcp\Support\Continuations;
use App\Mcp\Support\JobPermissionReader;
use App\Mcp\Support\LoggedMcpCall;
use App\Mcp\Support\McpCatalogue;
use App\Mcp\Support\RetainedNumberedPages;
use App\Mcp\Support\TextFields;
use App\Support\AgentContext;
use Illuminate\Cache\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;

/**
 * Serves the journal's MCP server on its signed route, limits each agent session to 120 calls a minute and prunes
 * expired retained pages daily.
 */
final class McpServiceProvider extends ServiceProvider
{
    private const int CALLS_PER_MINUTE = 120;

    public function register(): void
    {
        $this->app->bind(JobPermissionReaderContract::class, JobPermissionReader::class);
        $this->app->bind(TextFieldsContract::class, TextFields::class);
        $this->app->bind(ContinuationsContract::class, Continuations::class);
        $this->app->bind(McpCall::class, LoggedMcpCall::class);
        $this->app->bind(NumberedPages::class, RetainedNumberedPages::class);
        $this->app->bind(JournalToolNames::class, McpCatalogue::class);
    }

    public function boot(RateLimiter $limiter): void
    {
        $this->loadRoutesFrom(dirname(__DIR__).'/Routes/mcp.php');
        $this->commands([ContractSnapshotCommand::class, RelayCommand::class]);

        $this->callAfterResolving(
            Schedule::class,
            fn (Schedule $schedule) => $schedule->command('model:prune', ['--model' => [RetainedPage::class]])->daily(),
        );

        $limiter->for('journal-mcp', fn (Request $request): Limit => Limit::perMinute(self::CALLS_PER_MINUTE)
            ->by($this->app->make(AgentContext::class)->sessionId)
            ->response(fn (Request $request, array $headers) => new JsonResponse(
                ['message' => 'Too many calls.', 'retry_after_seconds' => (int) ($headers['Retry-After'] ?? 0)],
                JsonResponse::HTTP_TOO_MANY_REQUESTS,
                $headers,
            )));
    }
}
