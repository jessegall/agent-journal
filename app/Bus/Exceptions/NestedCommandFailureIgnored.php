<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class NestedCommandFailureIgnored extends RuntimeException
{
    public static function for(string $outer, string $inner): self
    {
        return new self(
            sprintf(
                'The command %s, dispatched inside %s, failed and %s caught it and went on; without a savepoint half of %s would commit, so let the failure end the whole command.',
                $inner,
                $outer,
                $outer,
                $inner,
            ),
        );
    }
}
