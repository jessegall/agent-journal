<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * Two declared routes that come out with one route name.
 */
final class UiRouteConflict extends UiDeclarationError
{
    public static function nameRepeated(string $routeName): self
    {
        return new self(
            sprintf(
                'Two declarations come out as the route %s; a page key and an action name of one domain must differ.',
                $routeName,
            ),
        );
    }
}
