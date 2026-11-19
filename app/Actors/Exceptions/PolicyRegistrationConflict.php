<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use RuntimeException;

final class PolicyRegistrationConflict extends RuntimeException
{
    public static function forModel(string $model, string $firstOwner, string $secondOwner): self
    {
        return new self(
            "{$firstOwner} and {$secondOwner} both register a policy for {$model}; one model has one policy.",
        );
    }

    public static function forPolicy(string $policy, string $firstOwner, string $secondOwner): self
    {
        return new self("{$firstOwner} and {$secondOwner} both register the policy {$policy}; register it once.");
    }
}
