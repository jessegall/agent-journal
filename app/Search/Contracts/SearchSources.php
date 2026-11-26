<?php

declare(strict_types=1);

namespace App\Search\Contracts;

use App\Search\Exceptions\SearchableMissing;
use App\Search\Exceptions\SearchValueInvalid;
use App\Search\Values\DeclaredSearchable;
use App\Search\Values\DiscoveryPage;
use App\Search\Values\SearchReader;

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

    /**
     * Who may search the declared source.
     */
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
