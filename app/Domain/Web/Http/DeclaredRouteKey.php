<?php

declare(strict_types=1);

namespace App\Domain\Web\Http;

use Illuminate\Routing\Route;

/**
 * The route default that holds the full key of the page or section a declared route is guarded by.
 */
final readonly class DeclaredRouteKey
{
    public const string NAME = 'declaration';

    /**
     * The full key a declared route was registered with.
     */
    public static function of(Route $route): string
    {
        return (string) $route->defaults[self::NAME];
    }
}
