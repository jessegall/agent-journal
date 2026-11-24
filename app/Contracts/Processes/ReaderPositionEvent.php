<?php

declare(strict_types=1);

namespace App\Contracts\Processes;

use App\Contracts\Events\Event;

/**
 * A change to a reader position: every event of it implements this, so a listener typed on it hears them all.
 */
interface ReaderPositionEvent extends Event {}
