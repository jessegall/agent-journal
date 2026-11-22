<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What a chosen scope came to: every source when none was chosen, one source, several sources sharing the label,
 * or none the caller may search.
 */
enum ScopeAnswer: string
{
    case Everywhere = 'everywhere';
    case Resolved = 'resolved';
    case Ambiguous = 'ambiguous';
    case Unknown = 'unknown';

    /**
     * Whether a search may run on this answer: over every source, or over the one resolved.
     */
    public function canSearch(): bool
    {
        return match ($this) {
            self::Everywhere, self::Resolved => true,
            self::Ambiguous, self::Unknown => false,
        };
    }
}
