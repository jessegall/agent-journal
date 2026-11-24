<?php

declare(strict_types=1);

namespace App\Data\Messages;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One bounded batch of a chat's unread text for an agent's driver: the batch to confirm against, the chat it comes
 * from, its items in timeline order after any references, and whether more waits there.
 */
final class MessageBatchData extends Data
{
    /**
     * @param  list<MessageBatchItemData>  $items
     */
    public function __construct(
        public readonly string $batchId,
        public readonly string $inboxId,
        public readonly string $inboxLabel,
        #[DataCollectionOf(MessageBatchItemData::class)]
        public readonly array $items,
        public readonly bool $hasMore,
        // The single grant an actionable batch carries for claiming a turn in this very turn; none for a batch with
        // nothing to answer.
        public readonly string|null $claimGrant = null,
    ) {}
}
