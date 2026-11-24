<?php

declare(strict_types=1);

namespace App\Data\Asks;

use App\Exceptions\SupervisorRouteInvalid;
use App\Values\SupervisorRoutes;
use Spatie\LaravelData\Data;

/**
 * A supervisor routes column: a JSON object of ask type key to supervisor target, its default under "default",
 * read through SupervisorRoutes::fromArray, which refuses a missing default or a target that is not text.
 */
final class StoredSupervisorRoutes extends Data
{
    public function __construct(public readonly SupervisorRoutes $routes) {}

    /**
     * @param  array<string, mixed>  $routes
     *
     * @throws SupervisorRouteInvalid
     */
    public static function fromArray(array $routes): self
    {
        return new self(SupervisorRoutes::fromArray($routes));
    }
}
