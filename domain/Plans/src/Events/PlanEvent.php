<?php

declare(strict_types=1);

namespace Domain\Plans\Events;

use App\Contracts\Events\Event;

/**
 * A fact about plans, their phases and reviews: every event of that subject extends it, so a listener typed on it hears them all.
 */
abstract readonly class PlanEvent implements Event {}
