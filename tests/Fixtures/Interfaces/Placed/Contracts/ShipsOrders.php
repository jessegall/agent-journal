<?php

declare(strict_types=1);

namespace Tests\Fixtures\Interfaces\Placed\Contracts;

interface ShipsOrders
{
    public function ship(string $orderId): void;
}
