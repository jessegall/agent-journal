<?php

declare(strict_types=1);

namespace Domain\Documents\Models\Concerns;

use App\Contracts\Actors\Actor;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\Enums\AttentionStatus;
use Domain\Documents\Events\RecordSettled;
use Domain\Documents\Exceptions\SettlementDenied;
use Domain\Documents\Models\RecordSettlement;

/**
 * Settling a document or a report: who may, what a repeated or different reason does, and the settlement history.
 */
trait Settles
{
    /**
     * Settles the record for this reason and announces it; the same reason again changes nothing, another one is
     * refused. Who may is decided before, and the settlement row is written beside it, by the caller.
     */
    public function settle(string $reason): bool
    {
        $last = RecordSettlement::query()->onRecord(static::linkType(), $this->id)->first();

        if ($this->attention === AttentionStatus::Settled && $last?->reason === $reason) {
            return false;
        }

        if ($this->attention === AttentionStatus::Settled) {
            throw SettlementDenied::settledFor((string) $last?->reason);
        }

        $this->attention = AttentionStatus::Settled;
        $this->saveAndAssert();
        $this->raise(new RecordSettled(static::linkType(), $this->id));

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
            ->onRecord(static::linkType(), $this->id)
            ->get()
            ->map(fn (RecordSettlement $settlement) => $settlement->card)
            ->all());
    }
}
