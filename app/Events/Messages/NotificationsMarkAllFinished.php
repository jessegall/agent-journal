<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Notifications\Contracts\NotificationsMarkAllEvent;

/**
 * Marking every notification read finished.
 */
final readonly class NotificationsMarkAllFinished implements MessageEvent, NotificationsMarkAllEvent
{
    public function __construct(public string $scopeId) {}
}
