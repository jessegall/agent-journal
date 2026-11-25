<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Contracts\Events\Event;

/**
 * A step of a process start, from its claim by a host to its stop.
 */
interface SessionProcessEvent extends Event {}
