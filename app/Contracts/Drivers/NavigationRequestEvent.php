<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

use App\Contracts\Events\Event;

/**
 * A change to a navigation request: every event of it implements this, so a listener typed on it hears them all.
 */
interface NavigationRequestEvent extends Event {}
