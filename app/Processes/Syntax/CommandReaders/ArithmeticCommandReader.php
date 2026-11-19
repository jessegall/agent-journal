<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Processes\Syntax\TokenCursor;

/**
 * (( expression )): an arithmetic command is not supported.
 */
final readonly class ArithmeticCommandReader extends UnsupportedCommandReader
{
    public static function reads(TokenCursor $cursor): bool
    {
        $literal = $cursor->currentLiteral();

        return $literal !== null && str_starts_with($literal, '((');
    }

    protected function reason(): string
    {
        return 'An arithmetic command (( )) is not supported.';
    }
}
