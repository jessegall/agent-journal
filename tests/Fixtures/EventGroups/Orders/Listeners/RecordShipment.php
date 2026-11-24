<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventGroups\Orders\Listeners;

use Tests\Fixtures\EventGroups\Orders\Events\OrderShipped;

/**
 * A listener typed on one event.
 */
final class RecordShipment
{
    public function handle(OrderShipped $event): void {}
}
