<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Models\RecordSettlement;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One settlement in a record's history: who settled it, why, when, and for a document the revision it was at.
 */
#[TypeScript]
final class SettlementCard extends Data
{
    public function __construct(
        public readonly string $actorType,
        public readonly string $actorId,
        public readonly string $reason,
        public readonly string|null $revision,
        public readonly string $settledAt,
    ) {}

    /**
     * A record's settlement as a card: who settled it, why and when.
     */
    public static function fromRecordSettlement(RecordSettlement $settlement): self
    {
        return self::from([
            'actorType' => $settlement->actor_type->value,
            'actorId' => $settlement->actor_id,
            'reason' => $settlement->reason,
            'revision' => $settlement->revision_number === null ? null : (string) $settlement->revision_number,
            'settledAt' => $settlement->settled_at->toIso8601String(),
        ]);
    }
}
