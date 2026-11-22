<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Sleeper;
use Illuminate\Database\DatabaseManager;

/**
 * Sleeps by moving the fake clock, and while asleep a rival session terminates the engine's database session, as an
 * administrator or a failover would.
 */
final readonly class TerminatingSleeper implements Sleeper
{
    public function __construct(
        private FakeMonotonicClock $clock,
        private DatabaseManager $databases,
        private string $engineConnection,
    ) {}

    public function sleep(int $nanoseconds): void
    {
        $enginePid = (int) $this->databases->connection($this->engineConnection)->scalar('select pg_backend_pid()');
        $this->databases->connection()->statement('select pg_terminate_backend(?)', [$enginePid]);
        $this->clock->advance($nanoseconds);
    }
}
