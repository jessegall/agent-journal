<?php

declare(strict_types=1);

namespace App\Mcp\Support;

/**
 * The omitted entries of a retained page that the caller may still read, in the page's order, and how many were
 * left out because they became unavailable, without naming them.
 *
 * @template T
 */
final readonly class RetainedEntries
{
    /**
     * @param  list<T>  $entries
     */
    public function __construct(public array $entries, public int $unavailableCount) {}
}
