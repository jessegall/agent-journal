<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A document's page: its published text and the state of its draft.
 */
#[TypeScript]
final class DocumentPageData extends Data
{
    /**
     * @param  list<RevisionCard>  $revisions
     */
    public function __construct(
        public readonly string $number,
        public readonly RecordPageData $record,
        public readonly DraftState $editing,
        #[DataCollectionOf(RevisionCard::class)]
        public readonly array $revisions,
    ) {}
}
