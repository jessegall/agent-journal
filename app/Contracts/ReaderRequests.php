<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Declarations\ResolverDefinition;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;

/**
 * What other Core areas use of the Web area's ReaderRequests.
 */
interface ReaderRequests
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
