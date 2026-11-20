<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Agents\Values\AccessPolicy;

final readonly class SupervisorProfile
{
    public function __construct(public ProfileKey $key, public SupervisorRoutes $routes, public AccessPolicy $access) {}
}
