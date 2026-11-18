<?php

declare(strict_types=1);

namespace App\Mcp\Support;

/**
 * The omitted entries of a retained page that the caller may still read, by reference in the page's order, the
 * offset of each in the retained page, and how many were left out because they became unavailable, without naming
 * them.
 *
 * @template T
 */
final readonly class RetainedEntries
{
    /**
     * @param  array<string, T>  $entries
     * @param  array<string, int>  $offsets
     */
    public function __construct(public array $entries, public array $offsets, public int $unavailableCount) {}

    /**
     * Every entry of a page read now, each at its place in the page.
     *
     * @template E
     *
     * @param  array<string, E>  $entries
     * @return self<E>
     */
    public static function wholePage(array $entries): self
    {
        return new self($entries, array_flip(array_map(strval(...), array_keys($entries))), 0);
    }
}
