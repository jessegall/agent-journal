<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\AllowedNames;
use App\Values\ReadRequest;

interface ReadGrant
{
    public function allows(ReadRequest $request): bool;

    public function assertAllowed(ReadRequest $request): void;

    /**
     * The targets the caller may run the named read for, such as the task ids a scoped tasks_read names.
     */
    public function allowedTargets(string $name): AllowedNames;
}
