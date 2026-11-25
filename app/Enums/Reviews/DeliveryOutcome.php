<?php

declare(strict_types=1);

namespace App\Enums\Reviews;

/**
 * Where a child's delivery stands: submitted for integration, the one outcome while deliveries are not merged.
 */
enum DeliveryOutcome: string
{
    case Submitted = 'submitted';
}
