<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Contracts\Events\Event;

/**
 * A fact about documents and reports: every event of that subject implements it, so a listener typed on it receives them all.
 */
interface DocumentEvent extends Event {}
