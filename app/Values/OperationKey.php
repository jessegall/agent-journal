<?php

declare(strict_types=1);

namespace App\Values;

final readonly class OperationKey
{
    public function __construct(public string $key) {}
}
