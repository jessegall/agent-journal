<?php

declare(strict_types=1);

namespace App\Http\Requests\Web\Concerns;

use App\Http\Support\Web\RouteId;

/**
 * Reads a record id from the route: a ULID, or the page is not found.
 */
trait ReadsRouteId
{
    protected function routeId(string $parameter): string
    {
        return RouteId::of((string) $this->route($parameter));
    }
}
