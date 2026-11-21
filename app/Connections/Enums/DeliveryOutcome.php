<?php

declare(strict_types=1);

namespace App\Connections\Enums;

/**
 * Where a child's delivery stands: submitted for integration, merged into its target, or in conflict with the
 * worker branch kept.
 */
enum DeliveryOutcome: string
{
    case Submitted = 'submitted';
    case Merged = 'merged';
    case Conflicted = 'conflicted';
}
