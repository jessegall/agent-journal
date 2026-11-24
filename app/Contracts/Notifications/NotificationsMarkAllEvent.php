<?php

declare(strict_types=1);

namespace App\Contracts\Notifications;

use App\Contracts\Events\Event;

/**
 * A step of marking every notification read: begun, advanced or finished.
 */
interface NotificationsMarkAllEvent extends Event {}
