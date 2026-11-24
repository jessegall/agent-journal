<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\NotificationsMarkAllEvent;

/**
 * Marking every notification read finished.
 */
final readonly class NotificationsMarkAllFinished extends MessageEvent implements NotificationsMarkAllEvent
{
    public function __construct(public string $scopeId) {}
}
