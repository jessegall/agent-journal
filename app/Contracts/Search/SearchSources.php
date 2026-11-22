<?php

declare(strict_types=1);

namespace App\Contracts\Search;

use App\Exceptions\SearchableMissing;
use App\Exceptions\SearchValueInvalid;
use App\Values\DeclaredSearchable;
use App\Values\DiscoveryPage;
use App\Values\SearchReader;

/**
 * The declared sources a reader may search: one by its key, its access policy, the hints for input too short to
 * search, and a page of them by prefix.
 */
interface SearchSources
{
    /**
     * @throws SearchableMissing
     */
    public function source(SearchReader $reader, string $qualifiedKey): DeclaredSearchable;

    public function access(DeclaredSearchable $source): SearchAccess;

    /**
     * @return list<string>
     */
    public function hints(SearchReader $reader, string $input): array;

    /**
     * @throws SearchValueInvalid
     */
    public function discover(
        SearchReader $reader,
        string $prefix,
        int $size = DiscoveryPage::DEFAULT_SIZE,
        string|null $after = null,
    ): DiscoveryPage;
}
