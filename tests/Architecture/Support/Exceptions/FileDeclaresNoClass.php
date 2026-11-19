<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\Exceptions;

use LogicException;

/**
 * A scanned PHP file lacks the namespace or the class an architecture check expects in it.
 */
final class FileDeclaresNoClass extends LogicException
{
    public static function withoutNamespace(string $file): self
    {
        return new self("{$file} declares no namespace.");
    }

    public static function withoutClass(string $file): self
    {
        return new self("{$file} declares no class.");
    }
}
