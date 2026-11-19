<?php

declare(strict_types=1);

namespace App\Web\Contracts;

use App\Ui\Contracts\PageResolver;
use App\Ui\Contracts\SectionResolver;
use App\Ui\Declarations\ResolverDefinition;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;

/**
 * What other Core areas use of the Web area's ReaderRequests.
 */
interface ListsReaderRequests
{
    /**
     * @param  array<string, mixed>  $query
     */
    public function pageReader(
        string $key,
        ResolverDefinition $resolver,
        Request $current,
        array $query,
        Route|null $route = null,
    ): PageResolver;

    /**
     * A section reads the page's plain query.
     */
    public function sectionReader(string $key, ResolverDefinition $resolver, Request $current): SectionResolver;
}
