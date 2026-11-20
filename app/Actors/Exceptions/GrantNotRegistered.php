<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use App\Operations\Enums\AccessType;
use RuntimeException;

final class GrantNotRegistered extends RuntimeException
{
    public static function for(string $policy, AccessType $access): self
    {
        return new self(
            "No available policy {$policy} grants {$access->value}; "
            .'register the policy and its access, or grant another.',
        );
    }

    public static function forPolicy(string $policy): self
    {
        return new self("No policy {$policy} is registered; register it before it grants anything.");
    }

    public static function forModel(string $model): self
    {
        return new self("No policy is registered for {$model}; register one before it grants anything.");
    }
}
