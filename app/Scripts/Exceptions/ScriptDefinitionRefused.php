<?php

declare(strict_types=1);

namespace App\Scripts\Exceptions;

use RuntimeException;

final class ScriptDefinitionRefused extends RuntimeException
{
    public static function invalidObject(string $class): self
    {
        return new self("The script object {$class} has an invalid declaration.");
    }

    public static function invalidMember(string $class, string $property): self
    {
        return new self("Script member {$class}::{$property} needs a public boolean and a registered read operation.");
    }

    public static function duplicate(string $key): self
    {
        return new self("Script definition {$key} is registered twice.");
    }

    public static function unknown(string $key): self
    {
        return new self("Script definition {$key} is not registered.");
    }

    public static function unavailable(string $key): self
    {
        return new self("Script definition {$key} is unavailable.");
    }

    public static function invalidOwner(string $owner): self
    {
        return new self("Script definitions cannot be contributed as {$owner}.");
    }

    public static function invalidKeyword(string $token): self
    {
        return new self("Script keyword {$token} has an invalid token.");
    }
}
