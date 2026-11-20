<?php

declare(strict_types=1);

namespace Domain\Documents\Models\Concerns;

use App\Actors\Contracts\Actor;
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
     * Who may is decided before, by the caller.
     */
    public function settle(Actor $actor, string $givenReason, int|null $revisionNumber): bool
    {
        $reason = trim($givenReason);
        $last = RecordSettlement::query()->onRecord(static::LINK_TYPE, $this->id)->first();

        if ($this->attention === AttentionState::Settled && $last?->reason === $reason) {
            return false;
        }

        if ($this->attention === AttentionState::Settled) {
            throw SettlementDenied::settledFor((string) $last?->reason);
        }

        RecordSettlement::create(static::LINK_TYPE, $this->id, $actor, $reason, $revisionNumber);
        $this->attention = AttentionState::Settled;
        $this->save();

        return true;
    }

    /**
     * Whether the actor created the record.
     */
    public function isCreatedBy(Actor $actor): bool
    {
        return $this->creator_type === $actor->actorType() && $this->creator_id === $actor->actorId();
    }

    /**
     * @return list<SettlementCard>
     */
    public function settlements(): array
    {
        return array_values(RecordSettlement::query()
            ->onRecord(static::LINK_TYPE, $this->id)
            ->get()
            ->map(fn (RecordSettlement $settlement) => $settlement->card())
            ->all());
    }
}
