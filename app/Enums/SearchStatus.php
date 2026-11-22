<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * How one search call ends. Complete has nothing left; more and pending continue; retryable keeps a safe boundary
 * after a source timed out once; incomplete ends this attempt; no_sources ran nothing; restart needs fresh words;
 * the scope answers name a scope the caller cannot search as typed.
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

    /**
     * Whether the answer carries a continuation to call next.
     */
    public function continues(): bool
    {
        return match ($this) {
            self::More, self::Pending, self::Retryable => true,
            self::Complete, self::Incomplete, self::NoSources, self::Restart,
            self::UnknownScope, self::AmbiguousScope => false,
        };
    }
}
