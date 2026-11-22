<?php

declare(strict_types=1);

namespace App\Communication\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One bounded batch of a chat's unread text for an agent's driver: the batch to confirm against, the chat it comes
 * from, its items in timeline order after any references, and whether more waits there.
 */
final class PresentationBatchData extends Data
{
    /**
     * @param  list<PresentationItemData>  $items
     */
    public function __construct(
        public readonly string $batchId,
        public readonly string $inboxId,
        public readonly string $inboxLabel,
        #[DataCollectionOf(PresentationItemData::class)]
        public readonly array $items,
        public readonly bool $more,
    ) {}
}
