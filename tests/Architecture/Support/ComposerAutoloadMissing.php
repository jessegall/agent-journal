<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use RuntimeException;

final class ComposerAutoloadMissing extends RuntimeException
{
    public static function for(string $composerPath): self
    {
        return new self("{$composerPath} has no autoload and autoload-dev psr-4 sections.");
    }
}
