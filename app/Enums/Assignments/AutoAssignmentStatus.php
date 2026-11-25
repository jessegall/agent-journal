<?php

declare(strict_types=1);

namespace App\Enums\Assignments;

/**
 * Where an auto-assignment stands now, derived each time it is read. Ready promises neither a candidate nor a running
 * ticker.
 */
enum AutoAssignmentStatus: string
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
            self::Inactive => 'Waiting',
            self::DomainUnavailable => 'Domain off',
            self::PoolUnavailable => 'Pool empty',
            self::TooLarge => 'Pool too large',
            self::Full => 'Full',
            self::OverCapacity => 'Over capacity',
            self::Ready => 'Ready',
            self::Invalid => 'Invalid settings',
        };
    }
}
