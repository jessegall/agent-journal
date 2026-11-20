<?php

declare(strict_types=1);

namespace App\Mcp\Data;

final readonly class SearchPage
{
    /** @param list<SearchHit> $hits */
    public function __construct(public array $hits, public bool $hasNextPage) {}
}
