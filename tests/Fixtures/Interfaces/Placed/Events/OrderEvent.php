<?php

declare(strict_types=1);

namespace Tests\Fixtures\Interfaces\Placed\Events;

use App\Contracts\Events\Event;

/**
 * The base event of an Events folder: it lives beside the events that implement it.
 */
interface OrderEvent extends Event {}
