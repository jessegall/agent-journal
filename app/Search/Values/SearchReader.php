<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Actors\Support\ActorContext;
use App\Search\Enums\SearchSurface;

/**
 * Who reads the results of a search and where: the authenticated actor and the surface that asked.
 */
final readonly class SearchReader
{
    public function __construct(
        public ActorContext $actor,
        public SearchSurface $surface,
    ) {}

    public function isAgent(): bool
    {
        return $this->actor->isAgent();
    }
}
