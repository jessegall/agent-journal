<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Domain\Documents\Enums\AttentionState;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A record's state as inspect shows it: whether it is being edited, whether it asks for attention, its settlements
 * and, for a document, how its drafts ended.
 */
#[TypeScript]
final class RecordInspection extends Data
{
    /**
     * @param  list<SettlementCard>  $settlements
     * @param  list<CloseCard>  $closes
     */
    public function __construct(
        public readonly string $label,
        public readonly AttentionState $attention,
        public readonly DraftState $editing,
        #[DataCollectionOf(SettlementCard::class)]
        public readonly array $settlements,
        #[DataCollectionOf(CloseCard::class)]
        public readonly array $closes,
    ) {}
}
