<?php

declare(strict_types=1);

namespace App\Domain\Web\Http;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Reads a record id from a route: a positive whole number within PHP's integer range, or not found before any work.
 */
final class RouteId
{
    public static function of(string $value): int
    {
        $isPositiveNumber = preg_match('/^[1-9][0-9]{0,18}$/', $value) === 1;
        $fitsInAnInteger = strlen($value) < 19 || strcmp($value, (string) PHP_INT_MAX) <= 0;

        if (! $isPositiveNumber || ! $fitsInAnInteger) {
            throw new NotFoundHttpException;
        }

        return (int) $value;
    }
}
