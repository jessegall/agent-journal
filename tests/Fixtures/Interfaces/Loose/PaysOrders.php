<?php

declare(strict_types=1);

namespace Tests\Fixtures\Interfaces\Loose;

interface PaysOrders
{
    public function pay(string $orderId): void;
}
