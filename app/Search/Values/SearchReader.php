<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Search\Enums\SearchSurface;
use App\Support\ActorReference;

/**
 * Who reads the results of a search and where: the authenticated actor and the surface that asked.
 */
final readonly class SearchReader
{
    public function __construct(
        public ActorReference $actor,
        public SearchSurface $surface,
    ) {}

    public function isAgent(): bool
    {
        return $this->actor->isAgent();
    }
}
