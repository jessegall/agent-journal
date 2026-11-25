<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

/**
 * Which records a list shows by attention: those still asking for it, those settled, or all.
 */
enum AttentionFilter: string
{
    case Active = 'active';
    case Settled = 'settled';
    case All = 'all';

    /**
     * The attention state a list keeps, or none when it keeps every record.
     */
    public function state(): AttentionStatus|null
    {
        return match ($this) {
            self::Active => AttentionStatus::Active,
            self::Settled => AttentionStatus::Settled,
            self::All => null,
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Settled => 'Settled',
            self::All => 'All',
        };
    }
}
