<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Time\ServerClock;
use App\Exceptions\ActiveActorsUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Values\ActiveActorsSnapshot;
use Carbon\CarbonImmutable;
use Throwable;

/**
 * Reads the database time once and runs every registered counter with it inside one repeatable-read, read-only
 * transaction, so all counts see one snapshot. A type with no counter counts zero; any failure is named, never zero.
 */
final readonly class ActiveActorsResolver
{
    public function __construct(
        private ActiveActorRegistration $counters,
        private ReadOnlyTransaction $transaction,
        private ServerClock $clock,
    ) {}

    public function snapshot(): ActiveActorsSnapshot
    {
        try {
            return $this->transaction->runInOneSnapshot(function (): ActiveActorsSnapshot {
                $observedAt = $this->clock->now();

                return new ActiveActorsSnapshot(
                    $observedAt,
                    $this->count(Agent::storedType(), $observedAt),
                    $this->count(User::storedType(), $observedAt),
                );
            });
        } catch (Throwable $cause) {
            throw ActiveActorsUnavailable::because($cause);
        }
    }

    private function count(string $type, CarbonImmutable $observedAt): int
    {
        if (! $this->counters->has($type)) {
            return 0;
        }

        return $this->counters->get($type)->count($observedAt);
    }
}
