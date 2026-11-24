<?php

declare(strict_types=1);

namespace App\Contracts\Events;

/**
 * A fact about one inbox: the page change it causes reaches only the inbox's active members.
 */
interface InboxScopedFact
{
    /**
     * The inbox whose members may hear the fact.
     */
    public function scopedInboxId(): string;
}
