<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use RuntimeException;

final class NameOutsideEveryDomain extends RuntimeException
{
    public static function for(string $name): self
    {
        return new self("{$name} lies in no domain, so it has no owning domain.");
    }
}
