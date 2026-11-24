<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventGroups\Orders\Events;

use App\Contracts\Events\Event;

/**
 * An event with no base.
 */
final readonly class OrderShipped implements Event {}
