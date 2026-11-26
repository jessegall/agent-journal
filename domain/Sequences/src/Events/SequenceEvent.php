<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Contracts\Events\Event;

/**
 * A fact about sequences and their runs: every event of that subject implements it, so a listener typed on it receives them all.
 */
interface SequenceEvent extends Event {}
