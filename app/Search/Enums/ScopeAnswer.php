<?php

declare(strict_types=1);

namespace App\Search\Enums;

/**
 * What a chosen scope came to: one source, several sources sharing the label, or none the caller may search.
 */
enum ScopeAnswer: string
{
    case Resolved = 'resolved';
    case Ambiguous = 'ambiguous';
    case Unknown = 'unknown';
}
