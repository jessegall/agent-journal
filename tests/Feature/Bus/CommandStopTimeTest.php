<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\CommandMiddleware\RunInTransaction;
use App\Bus\Contracts\StopTime;
use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\CommandCall;
use App\Bus\Support\CommandStops;
use App\Bus\Support\OperationDeadline;
use App\Engine\Support\MonotonicStop;
use App\Engine\Support\SystemMonotonicClock;
use Exception;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\QueryException;
use PDOException;
use ReflectionProperty;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A command run under an absolute stop time: every attempt, retries included, gets only the time left until the stop
 * as its statement limit, never a fresh budget; once the stop has passed it is refused with the deadline refusal;
 * and the stops and limits outside it hold again afterwards.
 */
final class CommandStopTimeTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    public function test_the_engine_auto_assignment_limits_are_process_configuration(): void
    {
        $this->assertSame([
            'interval_seconds' => 5,
            'facts_per_pass' => 20,
            'claims_per_pass' => 5,
            'max_slice_ms' => 100,
            'slice_share' => 0.2,
            'ordered_ids_max' => 1000,
        ], $this->app->make('config')->get('engine.auto_assignments'));
    }

    public function test_a_retry_gets_the_time_left_until_the_stop_not_a_fresh_budget(): void
    {
        $stops = $this->app->make(CommandStops::class);
        $clock = new SystemMonotonicClock();
        $stop = new MonotonicStop($clock, $clock->nanoseconds() + 50_000_000);
        $limits = [];

        $result = $stops->runUntil($stop, function () use (&$limits): mixed {
            return $this->transaction()->handle(
                $this->writeNoteCall(),
                function () use (&$limits): string {
                    $limits[] = $this->statementLimit();

                    if (count($limits) === 1) {
                        usleep(20_000);

                        throw self::serializationFailure();
                    }

                    return 'done';
                },
            );
        });

        $this->assertSame('done', $result);
        $this->assertCount(2, $limits);
        $this->assertLessThanOrEqual(50, $limits[0]);
        $this->assertLessThanOrEqual(30, $limits[1]);
        $this->assertLessThan($limits[0], $limits[1]);
    }

    public function test_once_the_stop_has_passed_the_retry_is_refused(): void
    {
        $stops = $this->app->make(CommandStops::class);
        $clock = new SystemMonotonicClock();
        $stop = new MonotonicStop($clock, $clock->nanoseconds() + 50_000_000);
        $attempts = 0;

        $this->expectException(StackLockTimedOut::class);

        try {
            $stops->runUntil($stop, function () use (&$attempts): mixed {
                return $this->transaction()->handle(
                    $this->writeNoteCall(),
                    function () use (&$attempts): never {
                        $attempts++;
                        usleep(60_000);

                        throw self::serializationFailure();
                    },
                );
            });
        } finally {
            $this->assertSame(1, $attempts);
        }
    }

    public function test_the_outer_deadline_and_limits_hold_again_after_the_stop(): void
    {
        $stops = $this->app->make(CommandStops::class);
        $deadline = new OperationDeadline(5000);
        $near = new class implements StopTime
        {
            public function remainingMilliseconds(): int
            {
                return 40;
            }
        };

        $inside = $stops->runUntil($near, fn () => $stops->limit($deadline)->milliseconds);
        $limit = $this->transaction()->handle($this->writeNoteCall(), fn () => $this->statementLimit());

        $this->assertSame(40, $inside);
        $this->assertSame($deadline, $stops->limit($deadline));
        $this->assertSame(5000, $limit);
        $this->assertSame('0', $this->app->make(ConnectionInterface::class)->scalar('SHOW statement_timeout'));
    }

    private function transaction(): RunInTransaction
    {
        $this->app->instance(OperationDeadline::class, new OperationDeadline(5000));

        return $this->app->make(RunInTransaction::class);
    }

    private function writeNoteCall(): CommandCall
    {
        return CommandCall::of(new WriteNote('A note'), 'Notes', false, false, null);
    }

    private function statementLimit(): int
    {
        $setting = $this->app->make(ConnectionInterface::class)
            ->scalar("SELECT setting FROM pg_settings WHERE name = 'statement_timeout'");

        return (int) $setting;
    }

    private static function serializationFailure(): QueryException
    {
        $cause = new PDOException('could not serialize access');
        new ReflectionProperty(Exception::class, 'code')->setValue($cause, '40001');

        return new QueryException('pgsql', 'select 1', [], $cause);
    }
}
