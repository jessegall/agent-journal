<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * The receipt of a delivery: its id and the tip it holds. It means submitted for integration, never merged.
 */
final readonly class DeliveryReceipt
{
    public function __construct(public string $id, public string $deliveredTip, public string $outcome) {}
}
