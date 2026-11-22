<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * An owner registered a dockable type twice, a class that cannot be docked or a provider that is none, or a
 * definition was asked about a source of another type.
 */
final class DockDefinitionInvalid extends LogicException
{
    public static function repeated(string $type, string $registered, string $repeated): self
    {
        return new self("{$type} is registered by both {$registered} and {$repeated}.");
    }

    public static function notDockable(string $type, string $class): self
    {
        return new self("{$class}, registered for {$type}, does not implement Dockable.");
    }

    public static function notAProvider(string $type, string $class): self
    {
        return new self("{$class}, registered for {$type}, is no dockable provider.");
    }

    public static function notOwned(string $type, string $class): self
    {
        return new self("{$class} is not the dockable registered for {$type}.");
    }

    public static function unknown(string $type): self
    {
        return new self("No dockable is registered for {$type}.");
    }
}
