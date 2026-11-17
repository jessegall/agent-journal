<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use RuntimeException;

final class DocblockTagInvalid extends RuntimeException
{
    public static function for(string $path, int $line, string $tag): self
    {
        return new self("{$path}:{$line} has a docblock tag {$tag} that cannot be parsed.");
    }
}
