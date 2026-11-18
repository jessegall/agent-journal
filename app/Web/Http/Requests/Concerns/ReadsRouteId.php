<?php

declare(strict_types=1);

namespace App\Web\Http\Requests\Concerns;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Reads a record id from the route: a positive whole number that fits an int, or the page is not found.
 */
trait ReadsRouteId
{
    protected function routeId(string $parameter): int
    {
        $value = (string) $this->route($parameter);

        if (preg_match('/^[1-9][0-9]{0,18}$/', $value) !== 1 || (strlen($value) === 19 && strcmp($value, (string) PHP_INT_MAX) > 0)) {
            throw new NotFoundHttpException;
        }

        return (int) $value;
    }
}
