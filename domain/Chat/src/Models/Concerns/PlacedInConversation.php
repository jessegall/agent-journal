<?php

declare(strict_types=1);

namespace Domain\Chat\Models\Concerns;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * A row placed in one chat, named by the chat's inbox.
 *
 * @property string $inbox_id
 */
trait PlacedInConversation
{
    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inConversation(Builder $query, string $inboxId): void
    {
        $query->where('inbox_id', $inboxId);
    }
}
