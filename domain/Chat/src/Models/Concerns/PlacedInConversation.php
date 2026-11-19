<?php

declare(strict_types=1);

namespace Domain\Chat\Models\Concerns;

use Domain\Chat\Support\ConversationPair;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * A row placed in one conversation, named by the pair of inboxes it is between.
 *
 * @property string $source_inbox_id
 * @property string $destination_inbox_id
 */
trait PlacedInConversation
{
    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inConversation(Builder $query, ConversationPair $pair): void
    {
        $query->where('source_inbox_id', $pair->sourceInboxId)
            ->where('destination_inbox_id', $pair->destinationInboxId);
    }

    public function conversation(): ConversationPair
    {
        return new ConversationPair($this->source_inbox_id, $this->destination_inbox_id);
    }
}
