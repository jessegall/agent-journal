<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Whether a disclosure shows its body before the user folds it open or shut.
 */
enum DisclosureState: string
{
    case Open = 'open';
    case Closed = 'closed';

    public function isOpen(): bool
    {
        return $this === self::Open;
    }
}
