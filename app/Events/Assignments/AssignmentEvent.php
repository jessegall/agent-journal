<?php

declare(strict_types=1);

namespace App\Events\Assignments;

use App\Contracts\Events\Event;

/**
 * A fact about assignments: every event of that subject implements it, so a listener typed on it receives them all.
 */
interface AssignmentEvent extends Event {}
