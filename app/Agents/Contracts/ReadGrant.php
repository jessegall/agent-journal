<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Values\ReadRequest;

interface ReadGrant
{
    public function allows(ReadRequest $request): bool;

    public function assertAllowed(ReadRequest $request): void;
}
