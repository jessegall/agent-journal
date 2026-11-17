<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Error;
use RuntimeException;

final class ParseFailed extends RuntimeException
{
    public static function for(string $path, Error $error): self
    {
        return new self("{$path} could not be parsed: {$error->getMessage()}", previous: $error);
    }

    public static function unreadable(string $path): self
    {
        return new self("{$path} could not be read.");
    }
}
