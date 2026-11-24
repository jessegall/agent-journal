<?php

declare(strict_types=1);

namespace App\Events\Asks;

use App\Contracts\Events\Event;

/**
 * A fact about asks and the hops that carry them: every event of that subject extends it, so a listener typed on it
 * hears them all.
 */
abstract readonly class AskEvent implements Event {}
