<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Notifications\Contracts\NotificationsMarkAllEvent;

/**
 * Marking every notification read began, up to the sequence given.
 */
final readonly class NotificationsMarkAllStarted implements MessageEvent, NotificationsMarkAllEvent
{
    public function __construct(public string $scopeId, public int $through) {}
}
