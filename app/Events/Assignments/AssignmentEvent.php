<?php

declare(strict_types=1);

namespace App\Events\Assignments;

use App\Contracts\Events\Event;

/**
 * A fact about assignments: every event of that subject extends it, so a listener typed on it hears them all.
 */
abstract readonly class AssignmentEvent implements Event {}
