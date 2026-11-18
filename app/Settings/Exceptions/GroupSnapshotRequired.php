<?php

declare(strict_types=1);

namespace App\Settings\Exceptions;

use LogicException;

/**
 * A setting of a group that can be switched off was read on its own; it is read through its group, which says first
 * whether the group is on.
 */
final class GroupSnapshotRequired extends LogicException
{
    public static function for(string $owner, string $key): self
    {
        return new self("The setting {$key} of {$owner} sits in a group that can be switched off: read it through that group.");
    }
}
