<?php

declare(strict_types=1);

namespace App\Reads\Contracts;

use App\Declarations\ResolverDefinition;
use App\Navigation\Contracts\SectionResolver;
use Illuminate\Http\Request;

/**
 * What other Core areas use of the Web area's ReaderRequests.
 */
interface ReaderRequests
{
    /**
     * A section reads the page's plain query.
     */
    public function sectionReader(string $key, ResolverDefinition $resolver, Request $current): SectionResolver;
}
