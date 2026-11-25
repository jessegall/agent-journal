<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventGroups\Orders\Events;

use App\Contracts\Events\Event;

/**
 * The base of the orders fixture domain's events.
 */
interface OrderEvent extends Event {}
