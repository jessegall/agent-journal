<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Declarations\ResolverDefinition;
use Closure;
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
}
