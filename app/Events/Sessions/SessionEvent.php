<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Events\Event;

/**
 * A fact about agents' sessions, runtimes, starts and starts: every event of that subject implements it, so a listener
 * typed on it receives them all.
 */
interface SessionEvent extends Event {}
