<?php

declare(strict_types=1);

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * A page read whose query does not name a route parameter its route needs, answered as missing.
 */
final class PageReadParameterMissing extends NotFoundHttpException
{
    public static function for(string $routeName, string $parameter): self
    {
        return new self("The read {$routeName} names no {$parameter}.");
    }
}
