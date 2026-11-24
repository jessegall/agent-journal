<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

use App\Contracts\Events\Event;

/**
 * A fact about helpers: every event of that subject extends it, so a listener typed on it hears them all.
 */
abstract readonly class HelperEvent implements Event {}
