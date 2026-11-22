<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Time\ServerClock;
use App\Enums\ActorType;
use App\Exceptions\ActiveActorsUnavailable;
use App\Values\ActiveActorsSnapshot;
use Carbon\CarbonImmutable;
use Illuminate\Database\ConnectionInterface;
use Throwable;

/**
 * Reads the database time once and runs every registered counter with it inside one repeatable-read, read-only
 * transaction, so all counts see one snapshot. A type with no counter counts zero; any failure is named, never zero.
 */
final readonly class ActiveActorsResolver
{
    public function __construct(
        private ActiveActorCounterRegistry $counters,
        private ConnectionInterface $database,
        private ServerClock $clock,
    ) {}

    public function snapshot(): ActiveActorsSnapshot
    {
        try {
            return $this->inOneSnapshot(function (): ActiveActorsSnapshot {
                $observedAt = $this->clock->now();

                return new ActiveActorsSnapshot(
                    $observedAt,
                    $this->count(ActorType::Agent, $observedAt),
                    $this->count(ActorType::User, $observedAt),
                );
            });
        } catch (Throwable $cause) {
            throw ActiveActorsUnavailable::because($cause);
        }
    }

    private function count(ActorType $type, CarbonImmutable $observedAt): int
    {
        if (! $this->counters->has($type)) {
            return 0;
        }

        return $this->counters->get($type)->count($observedAt);
    }

    /**
     * @param  callable(): ActiveActorsSnapshot  $read
     */
    private function inOneSnapshot(callable $read): ActiveActorsSnapshot
    {
        $this->database->beginTransaction();

        try {
            $this->database->statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY');
            $snapshot = $read();
            $this->database->commit();

            return $snapshot;
        } catch (Throwable $failure) {
            $this->database->rollBack();

            throw $failure;
        }
    }
}
