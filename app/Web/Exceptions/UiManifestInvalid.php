<?php

declare(strict_types=1);

namespace App\Web\Exceptions;

use RuntimeException;

final class UiManifestInvalid extends RuntimeException
{
    public static function emptyOrUnmarked(string $path): self
    {
        return new self("The generated {$path} came out empty or without the build's hash; nothing was replaced.");
    }
}
