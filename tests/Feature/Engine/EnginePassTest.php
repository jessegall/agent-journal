<?php

declare(strict_types=1);

namespace Tests\Feature\Engine;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Time\MonotonicClock;
use App\Exceptions\RepeatedReadRefused;
use App\Support\EnginePass;
use App\Support\EngineSettings;
use App\Support\OperationDeadline;
use App\Support\ReadMeter;
use App\Support\ServerClock;
use App\Support\SystemActor;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Tests\Support\CommitsHookRows;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\FakeMonotonicClock;
use Tests\TestCase;

/**
 * Each engine pass is its own operation: its own read entry, the engine as actor only inside it, a deadline counting
 * down its budget, and nothing left behind, even when it throws. A repeated read inside one pass is still refused.
 */
final class EnginePassTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    private FakeMonotonicClock $clock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->clock = new FakeMonotonicClock();
        $this->app->instance(MonotonicClock::class, $this->clock);
    }

    public function test_twelve_passes_log_twelve_separate_read_entries(): void
    {
        $entries = [];
        Log::listen(function ($message) use (&$entries): void {
            if ($message->message === 'reads' && $message->context['label'] === 'engine pass') {
                $entries[] = $message->context['queries_run'];
            }
        });

        foreach (range(1, 12) as $pass) {
            $this->app->make(EnginePass::class)->run(fn () => $this->app->make(ServerClock::class)->now());
        }

        $this->assertSame(array_fill(0, 12, 1), $entries);
    }

    public function test_the_engine_acts_only_inside_its_pass(): void
    {
        $inside = $this->app->make(EnginePass::class)->run(
            fn () => $this->app->make(CurrentActor::class)->actor()->type,
        );

        $this->assertSame(SystemActor::storedType(), $inside);
        $this->assertFalse($this->app->make(CurrentActor::class)->hasActor());
    }

    public function test_a_failing_pass_leaves_no_actor_no_transaction_and_a_fresh_scope(): void
    {
        $passMeter = null;

        $failingPass = function () use (&$passMeter): void {
            $passMeter = ReadMeter::ofCurrentScope();
            $this->app->make(DatabaseManager::class)->connection()->beginTransaction();

            throw SimulatedFailure::of('The pass failed.');
        };

        $this->assertThrows(fn () => $this->app->make(EnginePass::class)->run($failingPass), RuntimeException::class);
        $this->assertInstanceOf(ReadMeter::class, $passMeter);

        $this->assertFalse($this->app->make(CurrentActor::class)->hasActor());
        $this->assertSame(0, $this->app->make(DatabaseManager::class)->connection()->transactionLevel());
        $this->assertNotSame($passMeter, ReadMeter::ofCurrentScope());
    }

    public function test_commands_of_a_pass_get_the_time_the_pass_has_left(): void
    {
        $budget = $this->app->make(EngineSettings::class)->passBudgetMilliseconds;

        $left = $this->app->make(EnginePass::class)->run(function (): int {
            $this->clock->advance(300_000_000);

            return $this->app->make(OperationDeadline::class)->milliseconds;
        });

        $this->assertSame($budget - 300, $left);
    }

    public function test_a_repeated_read_inside_one_pass_is_still_refused(): void
    {
        $this->expectException(RepeatedReadRefused::class);

        $this->app->make(EnginePass::class)->run(function (): void {
            foreach (range(1, 12) as $read) {
                $this->app->make(ServerClock::class)->now();
            }
        });
    }
}
