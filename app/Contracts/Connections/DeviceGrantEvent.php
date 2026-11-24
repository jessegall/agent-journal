<?php

declare(strict_types=1);

namespace App\Contracts\Connections;

use App\Contracts\Events\Event;

/**
 * A change to a device grant: every event of it implements this, so a listener typed on it hears them all.
 */
interface DeviceGrantEvent extends Event {}
