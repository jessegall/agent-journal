<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use RuntimeException;

final class PolicyRegistrationConflict extends RuntimeException
{
    public static function forModel(string $model, string $firstOwner, string $secondOwner): self
    {
        return new self(
            "{$firstOwner} and {$secondOwner} both register a policy for {$model}; one owner guards one model.",
        );
    }

    public static function forPolicy(string $policy, string $firstOwner, string $secondOwner): self
    {
        return new self("{$firstOwner} and {$secondOwner} both register the policy {$policy}; register it once.");
    }

    public static function forRecordPolicy(string $model, string $first, string $second): self
    {
        return new self("{$first} and {$second} are both record policies for {$model}; one model has one.");
    }

    public static function forGate(string $model, string $policy, string $resolved): self
    {
        return new self("Laravel resolves {$resolved} for {$model}, but the journal registered {$policy} for it.");
    }

    /**
     * @param  'owner-only'|'coordinator-only'|'not-for-read-only'  $restriction
     */
    public static function forRestriction(string $policy, string $restriction): self
    {
        return new self("The {$restriction} accesses of {$policy} must be accesses it accepts.");
    }
}
