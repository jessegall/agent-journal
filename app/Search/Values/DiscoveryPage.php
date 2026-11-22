<?php

declare(strict_types=1);

namespace App\Search\Values;

/**
 * One page of the sources a caller may search whose key or label starts with a prefix, in binary key order, and
 * the key the next page starts after when there is one.
 */
final readonly class DiscoveryPage
{
    public const int DEFAULT_SIZE = 10;

    public const int SIZE_LIMIT = 50;

    /**
     * @param  list<DeclaredSearchable>  $sources
     */
    public function __construct(
        public string $prefix,
        public array $sources,
        public string|null $nextAfter,
    ) {}

    public function hasMore(): bool
    {
        return $this->nextAfter !== null;
    }
}
