<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use App\Agents\Values\OperationKey;

final readonly class ObjectMember
{
    public function __construct(public string $name, public OperationKey $read) {}
}
