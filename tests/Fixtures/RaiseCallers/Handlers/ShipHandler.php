<?php

declare(strict_types=1);

namespace Tests\Fixtures\RaiseCallers\Handlers;

use Tests\Fixtures\RaiseCallers\Models\Shipment;

/**
 * A command handler that runs the transition inside its command's unit.
 */
final readonly class ShipHandler
{
    public function handle(Shipment $shipment): void
    {
        $shipment->ship();
    }
}
