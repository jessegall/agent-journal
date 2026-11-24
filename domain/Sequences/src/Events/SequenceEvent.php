<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Contracts\Events\Event;

/**
 * A fact about sequences and their runs: every event of that subject extends it, so a listener typed on it hears them all.
 */
abstract readonly class SequenceEvent implements Event {}
