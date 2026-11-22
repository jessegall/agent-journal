<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A catalogue asked for an owner that registers no settings definition, which is not the same as an owner with none.
 */
final class SettingsOwnerUnknown extends LogicException
{
    public static function for(string $owner): self
    {
        return new self("No settings definition is registered for {$owner}.");
    }
}
