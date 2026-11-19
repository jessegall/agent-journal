<?php

declare(strict_types=1);

namespace App\Settings\Exceptions;

use LogicException;

/**
 * A setting handle that no registered definition declares: built by hand instead of taken from the registered
 * definition.
 */
final class SettingHandleUnknown extends LogicException
{
    public static function for(string $owner, string $key): self
    {
        return new self(
            sprintf(
                'No registered definition of %s declares the setting %s: inject the registered definition instead of constructing another.',
                $owner,
                $key,
            ),
        );
    }

    public static function owner(string $owner): self
    {
        return new self("No settings definition is registered for {$owner}.");
    }

    public static function definition(string $definition): self
    {
        return new self(
            sprintf(
                'This %s is not the registered one: inject the registered definition instead of constructing another.',
                $definition,
            ),
        );
    }
}
