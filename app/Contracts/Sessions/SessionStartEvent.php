<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Contracts\Events\Event;

/**
 * A change to a session start: every event of it implements this, so a listener typed on it hears them all.
 */
interface SessionStartEvent extends Event {}
