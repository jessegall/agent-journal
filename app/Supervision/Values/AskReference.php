<?php

declare(strict_types=1);

namespace App\Supervision\Values;

final readonly class AskReference
{
    public function __construct(public string $id) {}
}
