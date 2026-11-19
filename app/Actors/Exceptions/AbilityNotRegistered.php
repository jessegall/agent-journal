<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use BackedEnum;
use RuntimeException;

final class AbilityNotRegistered extends RuntimeException
{
    public static function for(string $policy, BackedEnum $ability): self
    {
        $name = $ability::class.'::'.$ability->name;

        return new self(
            "No available policy {$policy} grants the ability {$name}; register the policy, or grant another.",
        );
    }
}
