<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

/**
 * A list of exports the application refuses to start with, naming the owner and the entry at fault.
 */
final class InvalidExports extends DomainDeclarationError
{
    public static function notAList(string $owner): self
    {
        return new self("{$owner} must export a plain list of class names.");
    }

    public static function notAName(string $owner, int $position): self
    {
        return new self("{$owner} exports something that is not a class name at position {$position}.");
    }

    public static function listedTwice(string $owner, string $name): self
    {
        return new self("{$owner} exports {$name} twice.");
    }

    public static function outsideOwner(string $owner, string $name, string $namespace): self
    {
        return new self("{$owner} exports {$name}, which is not in its own namespace {$namespace}.");
    }
}
