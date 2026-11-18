<?php

declare(strict_types=1);

namespace App\Http\Support\Web;

use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Reads a record id from a route: a ULID, or not found before any work.
 */
final class RouteId
{
    public static function of(string $value): string
    {
        if (! Str::isUlid($value)) {
            throw new NotFoundHttpException;
        }

        return strtolower($value);
    }
}
