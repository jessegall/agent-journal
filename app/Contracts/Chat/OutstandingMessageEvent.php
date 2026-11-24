<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Events\Event;

/**
 * A change to a outstanding message: every event of it implements this, so a listener typed on it hears them all.
 */
interface OutstandingMessageEvent extends Event {}
