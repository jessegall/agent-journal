<?php

declare(strict_types=1);

namespace App\Notifications\Contracts;

use App\Contracts\Events\Event;

/**
 * A step of marking every notification read: started, advanced or finished.
 */
interface NotificationsMarkAllEvent extends Event
{
    public string $scopeId { get; }
}
