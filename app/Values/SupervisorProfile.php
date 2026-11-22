<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A profile as supervision routing reads it: its key, its supervisor routes and the commands its grants admit.
 */
final readonly class SupervisorProfile
{
    public function __construct(
        public ProfileKey $key,
        public SupervisorRoutes $routes,
        public ProfileAuthorization $authorization,
    ) {}
}
