<?php

declare(strict_types=1);

namespace App\Contracts\Events;

/**
 * A fact about one chat inbox: the page change it causes reaches only the chat's active members.
 */
interface InboxScopedFact
{
    public function scopedInboxId(): string;
}
