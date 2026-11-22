<?php

declare(strict_types=1);

namespace App\Contracts;

interface InboxNotices
{
    public function sendFromJournal(Actor|null $recipient, string $body, string $key): string;
}
