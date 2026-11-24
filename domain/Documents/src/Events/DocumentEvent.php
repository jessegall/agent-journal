<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Contracts\Events\Event;

/**
 * A fact about documents and reports: every event of that subject extends it, so a listener typed on it hears them all.
 */
abstract readonly class DocumentEvent implements Event {}
