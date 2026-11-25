<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Search\SearchSurface;
use App\Support\ActorIdentity;

/**
 * Who reads the results of a search and where: the authenticated actor and the surface that asked.
 */
final readonly class SearchReader
{
    public function __construct(
        public ActorIdentity $actor,
        public SearchSurface $surface,
    ) {}

    public function isAgent(): bool
    {
        return $this->actor->isAgent();
    }
}
