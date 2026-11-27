<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Hosts\EnrolledHost;
use App\Models\Hosts\HostOrder;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * A host the test enrolled: its id and the orders the journal made for the host itself, for no process of it.
 */
final readonly class HostFacts implements Facts
{
    public function __construct(private EnrolledHost $host) {}

    public function facts(): array
    {
        return [
            'id' => $this->host->hostId,
            'orders' => fn () => array_map(
                fn (HostOrder $order) => new HostOrderFacts($order),
                HostOrder::findForHostItself($this->host->hostId),
            ),
        ];
    }
}
