<?php

declare(strict_types=1);

namespace App\Events\Access;

use App\Contracts\Events\Event;

/**
 * A fact about users and their grants: every event of that subject extends it, so a listener typed on it hears them
 * all.
 */
abstract readonly class AccessEvent implements Event {}
