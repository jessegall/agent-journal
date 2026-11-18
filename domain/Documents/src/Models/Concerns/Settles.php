<?php

declare(strict_types=1);

namespace Domain\Documents\Models\Concerns;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Exceptions\SettlementDenied;
use Domain\Documents\Models\RecordSettlement;

/**
 * Settling a document or a report: who may, what a repeated or different reason does, and the settlement history.
 */
trait Settles
{
    /**
     * Settles the record for this reason; the same reason again changes nothing, another one is refused.
     *
     * @throws SettlementDenied
     */
    public function settle(Actor $actor, string $reason, int|null $revisionNumber): bool
    {
        if (! $this->allowsChangesBy($actor)) {
            throw SettlementDenied::notCreator();
        }

        $last = RecordSettlement::query()->onRecord(static::LINK_TYPE, $this->id)->first();

        if ($this->attention === AttentionState::Settled && $last?->reason === $reason) {
            return false;
        }

        if ($this->attention === AttentionState::Settled) {
            throw SettlementDenied::settledFor((string) $last?->reason);
        }

        RecordSettlement::record(static::LINK_TYPE, $this->id, $actor, $reason, $revisionNumber);
        $this->attention = AttentionState::Settled;
        $this->save();

        return true;
    }

    /**
     * A user may change any record; an agent only the records it created.
     */
    public function allowsChangesBy(Actor $actor): bool
    {
        return $actor->actorType() === ActorType::User || ($this->creator_type === ActorType::Agent && $this->creator_id === $actor->actorId());
    }

    /**
     * @return list<SettlementCard>
     */
    public function settlements(): array
    {
        return array_values(RecordSettlement::query()->onRecord(static::LINK_TYPE, $this->id)->get()->map(fn (RecordSettlement $settlement) => $settlement->card())->all());
    }
}
