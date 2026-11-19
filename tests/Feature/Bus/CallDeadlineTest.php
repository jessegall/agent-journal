<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\AgentRequests\Support\SignedCall;
use App\Agents\Support\AgentContext;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Support\StackTransaction;
use App\Http\Middleware\Mcp\SetCallDeadline;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\TestCase;

/**
 * An MCP call's deadline is the earlier of 15 seconds from entry and 19 seconds after its signed issue time; a call
 * past it is refused before anything runs, and the transaction's lock wait comes from what is left.
 */
final class CallDeadlineTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials'];

    public function test_a_call_signed_18_seconds_ago_gets_about_one_second(): void
    {
        $this->signedSecondsAgo(18);

        $milliseconds = $this->throughMiddleware(fn (): int => $this->app->make(OperationDeadline::class)->milliseconds);

        $this->assertGreaterThan(800, $milliseconds);
        $this->assertLessThanOrEqual(1000, $milliseconds);
    }

    public function test_a_fresh_call_gets_15_seconds_and_the_default_comes_back_after_it(): void
    {
        $default = $this->app->make(OperationDeadline::class);
        $this->signedSecondsAgo(0);

        $this->assertSame(15_000, $this->throughMiddleware(fn (): int => $this->app->make(OperationDeadline::class)->milliseconds));
        $this->assertSame($default, $this->app->make(OperationDeadline::class));
    }

    public function test_the_lock_wait_inside_its_transaction_comes_from_the_remaining_time(): void
    {
        $this->signedSecondsAgo(14);

        [$lockTimeout, $deadline] = $this->throughMiddleware(fn (): array => [
            $this->app->make(StackTransaction::class)->run(fn (): mixed => $this->app->make(ConnectionInterface::class)->scalar("SELECT current_setting('lock_timeout')")),
            $this->app->make(OperationDeadline::class),
        ]);

        $this->assertSame("{$deadline->lockMilliseconds()}ms", $lockTimeout);
        $this->assertLessThanOrEqual(5000, $deadline->milliseconds);
    }

    public function test_a_call_signed_25_seconds_ago_is_refused_before_any_handler_runs(): void
    {
        $launch = TestLaunch::start();

        $this->sendMcp($launch, 'tools/list', issuedAt: CarbonImmutable::now()->subSeconds(25)->getTimestamp())
            ->assertStatus(408)
            ->assertJsonPath('id', 1)
            ->assertJsonPath('error.data.code', 'deadline_expired');

        $this->assertNull($launch->session->fresh()?->discovered_at);
    }

    private function signedSecondsAgo(int $seconds): void
    {
        $this->app->instance(AgentContext::class, new AgentContext('agent-1', 'session-1', new SignedCall('call-1', CarbonImmutable::now()->subSeconds($seconds), 'digest'), null));
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $inside
     * @return TResult
     */
    private function throughMiddleware(Closure $inside): mixed
    {
        $seen = null;
        $this->app->make(SetCallDeadline::class)->handle(Request::create('/agent/mcp/v1', 'POST'), function () use ($inside, &$seen): Response {
            $seen = $inside();

            return new Response();
        });

        return $seen;
    }
}
