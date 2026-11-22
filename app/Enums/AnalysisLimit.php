<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * The fixed limits of one shell analysis (doc 21 revision 3, section 5): a line past any of them keeps only a
 * diagnostic naming the limit.
 */
enum AnalysisLimit: int
{
    case SourceBytes = 65_536;
    case ExecutableParts = 1_024;
    case Depth = 32;
    case Milliseconds = 100;

    /**
     * Whether a measured amount goes past the limit.
     */
    public function isPassedBy(int|float $amount): bool
    {
        return $amount > $this->value;
    }

    /**
     * The limit as a reader names it, such as 64 KiB or 100 ms.
     */
    public function label(): string
    {
        return match ($this) {
            self::SourceBytes => intdiv($this->value, 1_024).' KiB',
            self::ExecutableParts => $this->value.' executable parts',
            self::Depth => 'depth '.$this->value,
            self::Milliseconds => $this->value.' ms',
        };
    }
}
