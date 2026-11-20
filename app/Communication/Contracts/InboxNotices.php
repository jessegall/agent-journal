<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Actors\Contracts\Actor;

interface InboxNotices
{
    public function sendFromJournal(Actor|null $recipient, string $body, string $key): string;
}
