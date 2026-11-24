<?php

declare(strict_types=1);

namespace App\Contracts\Authorization;

interface OperationNames
{
    /**
     * Whether an operation of that name is known.
     */
    public function has(string $operation): bool;
}
