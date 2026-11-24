<?php

declare(strict_types=1);

namespace App\Contracts\Authorization;

use App\Values\AllowedNames;
use App\Values\ReadRequest;

interface ReadGrant
{
    /**
     * Whether the grant covers the read.
     */
    public function allows(ReadRequest $request): bool;

    /**
     * Refuses the read when the grant does not cover it.
     */
    public function assertAllowed(ReadRequest $request): void;

    /**
     * The targets the caller may run the named read for, such as the task ids a scoped tasks_read names.
     */
    public function allowedTargets(string $name): AllowedNames;
}
