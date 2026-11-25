<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Reads\ReadLog;
use App\Contracts\Time\MonotonicClock;
use App\Enums\Accounts\CommandEntry;
use App\Values\TrustedEntryAuthority;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\DatabaseManager;

/**
 * Runs one engine pass as a fresh operation: new scoped instances, a deadline that counts down the pass budget, its
 * own read measurement and the engine as actor. Afterwards nothing of it is left: no actor, no grant, no open
 * transaction and no scoped instance. It keeps no scoped object between passes.
 */
final readonly class EnginePass
{
    private const int NANOSECONDS_PER_MILLISECOND = 1_000_000;

    public function __construct(
        private Application $app,
        private DatabaseManager $databases,
        private MonotonicClock $clock,
        private EngineSettings $settings,
        private ReadLog $reads,
    ) {}

    /**
     * @template TValue
     *
     * @param  callable(): TValue  $work
     * @return TValue
     */
    public function run(callable $work): mixed
    {
        $this->app->forgetScopedInstances();
        $previousDeadline = $this->app->getBindings()[OperationDeadline::class] ?? null;
        $this->bindPassDeadline($this->clock->nanoseconds());
        $meter = ReadMeter::ofCurrentScope();
        $meter->begin();

        try {
            $authority = new TrustedEntryAuthority('engine pass');
            $this->app->make(CurrentActorSetter::class)->set(new SystemActor(), $authority);

            return $this->app->make(CommandEntrance::class)->through(CommandEntry::EngineMaintenance, $work(...));
        } finally {
            $this->app->make(CurrentActorSetter::class)->clear();
            $this->app->make(EngineAccess::class)->clear();
            $this->rollBackOpenTransactions();
            $this->reads->record('engine pass', $meter->end());
            $this->restoreDeadline($previousDeadline);
            $this->app->forgetScopedInstances();
        }
    }

    /**
     * Every command of the pass gets the time the pass has left, so its lock and statement limits end with the pass.
     */
    private function bindPassDeadline(int $startNanoseconds): void
    {
        $budget = $this->settings->passBudgetMilliseconds;

        $this->app->bind(OperationDeadline::class, fn () => new OperationDeadline(
            $budget - intdiv($this->clock->nanoseconds() - $startNanoseconds, self::NANOSECONDS_PER_MILLISECOND),
        ));
    }

    /**
     * @param  array{concrete: \Closure, shared: bool}|null  $previous
     */
    private function restoreDeadline(array|null $previous): void
    {
        if ($previous === null) {
            return;
        }

        $this->app->bind(OperationDeadline::class, $previous['concrete'], $previous['shared']);
    }

    private function rollBackOpenTransactions(): void
    {
        foreach ($this->databases->getConnections() as $connection) {
            if ($connection->transactionLevel() > 0) {
                $connection->rollBack(0);
            }
        }
    }
}
