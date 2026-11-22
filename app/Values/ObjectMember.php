<?php

declare(strict_types=1);

namespace App\Values;

final readonly class ObjectMember
{
    public function __construct(public string $name, public OperationKey $read) {}
}
