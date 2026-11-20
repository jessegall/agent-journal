<?php

declare(strict_types=1);

namespace App\Http\Requests\Web\Concerns;

use App\Http\Support\Web\RouteNumber;

/**
 * Reads a record number from a user route, or the page is not found.
 */
trait ReadsRouteNumber
{
    protected function routeNumber(string $parameter): int
    {
        return RouteNumber::of((string) $this->route($parameter));
    }
}
