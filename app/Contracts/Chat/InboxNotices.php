<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Actors\Actor;

interface InboxNotices
{
    /**
     * Sends a notice the journal itself writes, to the recipient or the owner when none is named, once per key, and
     * gives its message id.
     */
    public function sendFromJournal(Actor|null $recipient, string $body, string $key): string;
}
