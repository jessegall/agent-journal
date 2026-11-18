<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class NestedCommandFailureIgnored extends RuntimeException
{
    public static function for(string $outer, string $inner): self
    {
        return new self("The command {$inner}, dispatched inside {$outer}, failed and {$outer} caught it and went on; without a savepoint half of {$inner} would commit, so let the failure end the whole command.");
    }
}
