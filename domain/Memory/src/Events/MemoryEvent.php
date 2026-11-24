<?php

declare(strict_types=1);

namespace Domain\Memory\Events;

use App\Contracts\Events\Event;

/**
 * A fact about memories: every event of that subject extends it, so a listener typed on it hears them all.
 */
abstract readonly class MemoryEvent implements Event {}
