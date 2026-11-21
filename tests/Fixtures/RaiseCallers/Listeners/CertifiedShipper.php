<?php

declare(strict_types=1);

namespace Tests\Fixtures\RaiseCallers\Listeners;

use Tests\Fixtures\RaiseCallers\Models\Shipment;

/**
 * The shape of FinishCertifiedJob: a public listener that runs the transition after the commit, outside any unit.
 */
final readonly class CertifiedShipper
{
    /**
     * @param  list<Shipment>  $open
     */
    public function handle(array $open): void
    {
        foreach ($open as $shipment) {
            $shipment->ship();
        }
    }
}
