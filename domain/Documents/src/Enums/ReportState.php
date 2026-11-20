<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

enum ReportState: string
{
    case Open = 'open';
    case Closed = 'closed';
    case All = 'all';

    public function attention(): AttentionFilter
    {
        return match ($this) {
            self::Open => AttentionFilter::Active,
            self::Closed => AttentionFilter::Settled,
            self::All => AttentionFilter::All,
        };
    }
}
