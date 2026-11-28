<?php

declare(strict_types=1);

namespace App\Navigation\Contracts;

use App\Access\Contracts\VisibilityCheck;
use App\Declarations\ResolverDefinition;
use Closure;
use App\Web\Creation\SurfaceDefinition;
use Spatie\LaravelData\Data;

/**
 * What other Core areas use of the Web area's WindowResults.
 */
interface WindowResults
{
    /**
     * @param  list<class-string<VisibilityCheck>>  $checks
     * @param  Closure(): Data  $read
     */
    public function result(string $key, array $checks, ResolverDefinition $resolver, Closure $read): Data;

    /**
     * @param list<class-string<VisibilityCheck>> $checks
     * @param Closure(): Data $read
     */
    public function surface(string $key, string $part, array $checks, SurfaceDefinition $surface, Closure $read): Data;
}
