<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;

/**
 * The one place that turns an actor into the key of its notification scope; every reader and writer of
 * notifications asks here. The web app holds one journal, so every actor's key is that journal's.
 */
final readonly class NotificationScopes
{
    public const string JOURNAL = 'journal';

    public function keyFor(ActorIdentity $actor): string
    {
        return self::JOURNAL;
    }
}
