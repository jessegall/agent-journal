<?php

declare(strict_types=1);

namespace App\Assignments\Enums;

/**
 * Where an auto-assignment stands now, derived each time it is read. Ready promises neither a candidate nor a running
 * ticker.
 */
enum AutoAssignmentState: string
{
    case Off = 'off';
    case Inactive = 'inactive';
    case DomainUnavailable = 'domain_unavailable';
    case PoolUnavailable = 'pool_unavailable';
    case TooLarge = 'too_large';
    case Full = 'full';
    case OverCapacity = 'over_capacity';
    case Ready = 'ready';
    case Invalid = 'invalid';

    public function label(): string
    {
        return match ($this) {
            self::Off => 'Off',
            self::Inactive => 'Waiting for the actor to be active',
            self::DomainUnavailable => 'Its domain is switched off',
            self::PoolUnavailable => 'Its pool gives out nothing now',
            self::TooLarge => 'Its pool is too large',
            self::Full => 'Full',
            self::OverCapacity => 'Holds more than its size',
            self::Ready => 'Ready',
            self::Invalid => 'Its configuration cannot be read',
        };
    }
}
