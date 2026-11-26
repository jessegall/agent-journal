<?php

declare(strict_types=1);

namespace App\Search\Enums;

/**
 * How one search call ends: complete, more or pending to continue, retryable after a source timed out, incomplete,
 * no_sources, restart for fresh words, a scope the caller cannot search as typed, or result_too_large when not one hit
 * fits an answer.
 */
enum SearchStatus: string
{
    case Complete = 'complete';
    case More = 'more';
    case Pending = 'pending';
    case Retryable = 'retryable';
    case Incomplete = 'incomplete';
    case NoSources = 'no_sources';
    case Restart = 'restart';
    case UnknownScope = 'unknown_scope';
    case AmbiguousScope = 'ambiguous_scope';
    case ResultTooLarge = 'result_too_large';

    /**
     * Whether the answer carries a continuation to call next.
     */
    public function continues(): bool
    {
        return match ($this) {
            self::More, self::Pending, self::Retryable => true,
            self::Complete, self::Incomplete, self::NoSources, self::Restart,
            self::UnknownScope, self::AmbiguousScope, self::ResultTooLarge => false,
        };
    }
}
