<?php

declare(strict_types=1);

namespace App\Core\Web\Exceptions;

use RuntimeException;

final class ReaderDataMismatch extends RuntimeException
{
    public static function for(string $key, string $declared, string $returned): self
    {
        return new self("The reader of {$key} declares {$declared} but returned {$returned}.");
    }
}
