<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Notifications\NotificationsMarkAllEvent;

/**
 * Marking every notification read reached the sequence given.
 */
final readonly class NotificationsMarkAllAdvanced extends MessageEvent implements NotificationsMarkAllEvent
{
    public function __construct(public string $scopeId, public int $sequence) {}
}
