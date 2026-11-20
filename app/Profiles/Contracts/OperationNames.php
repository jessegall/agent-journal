<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

use App\Profiles\Support\ConfiguredOperations;
use Illuminate\Container\Attributes\Bind;

#[Bind(ConfiguredOperations::class)]
interface OperationNames
{
    public function has(string $operation): bool;
}
