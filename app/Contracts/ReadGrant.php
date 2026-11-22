<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\ReadRequest;

interface ReadGrant
{
    public function allows(ReadRequest $request): bool;

    public function assertAllowed(ReadRequest $request): void;
}
