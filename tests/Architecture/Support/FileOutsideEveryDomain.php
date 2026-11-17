<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use RuntimeException;

final class FileOutsideEveryDomain extends RuntimeException
{
    public static function for(string $path): self
    {
        return new self("{$path} lies in no domain folder, so its table use cannot be judged.");
    }
}
