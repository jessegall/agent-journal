<?php

declare(strict_types=1);

namespace App\Web;

use App\Support\RecordReference;
use App\Web\Exceptions\InvalidRecordReference;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Reads a record number from a user route, such as the 12 of /plans/12, through the one record number parser; a
 * route without a valid number is not found before any work.
 */
final class RouteNumber
{
    public static function of(string $numberText): int
    {
        try {
            return RecordReference::number($numberText);
        } catch (InvalidRecordReference $invalid) {
            throw new NotFoundHttpException(previous: $invalid);
        }
    }
}
