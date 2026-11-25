<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\SupervisorRouteInvalid;
use Spatie\LaravelData\Data;

final class AskTypeKey extends Data
{
    /**
     * The route an ask without a type of its own follows.
     */
    public const string DEFAULT_ROUTE = 'default';

    /**
     * @throws SupervisorRouteInvalid
     */
    public function __construct(public readonly string $key)
    {
        if ($key === self::DEFAULT_ROUTE || preg_match('/^[a-z][a-z0-9]*(?:[.-][a-z][a-z0-9]*)*$/D', $key) !== 1) {
            throw SupervisorRouteInvalid::askType($key);
        }
    }

    public static function of(string $key): self
    {
        return new self($key);
    }

    /**
     * The route key of an ask of this type, or of the default route for an ask without one.
     */
    public static function routeOf(self|null $type): string
    {
        if ($type === null) {
            return self::DEFAULT_ROUTE;
        }

        return $type->key;
    }
}
