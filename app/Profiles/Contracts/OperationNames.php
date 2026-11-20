<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

interface OperationNames
{
    public function has(string $operation): bool;
}
