<?php

declare(strict_types=1);

namespace Tests\Fixtures\RaiseCallers\Listeners;

use Tests\Fixtures\RaiseCallers\Attributes\InCommandTransaction;
use Tests\Fixtures\RaiseCallers\Models\Shipment;

/**
 * A transaction listener: it runs inside the command's transaction, so its transition's fact is collected.
 */
#[InCommandTransaction]
final readonly class TransactionShipper
{
    public function handle(Shipment $shipment): void
    {
        $shipment->ship();
    }
}
