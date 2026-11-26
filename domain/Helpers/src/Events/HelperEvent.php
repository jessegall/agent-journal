<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

use App\Contracts\Events\Event;

/**
 * A fact about helpers: every event of that subject implements it, so a listener typed on it receives them all.
 */
interface HelperEvent extends Event {}
