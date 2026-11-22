<?php

declare(strict_types=1);

namespace App\Values;

final readonly class AskReference
{
    public function __construct(public string $id) {}
}
