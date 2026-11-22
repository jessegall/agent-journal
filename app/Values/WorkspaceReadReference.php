<?php

declare(strict_types=1);

namespace App\Values;

final readonly class WorkspaceReadReference
{
    public function __construct(public string $key) {}
}
