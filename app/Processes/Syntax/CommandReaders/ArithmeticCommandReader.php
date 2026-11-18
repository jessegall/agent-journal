<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Processes\Contracts\CommandReader;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Syntax\UnsupportedConstructs;
use App\Processes\Values\Grammar\CommandReading;

/**
 * (( arithmetic )) is not supported: read past it as one Unsupported node.
 */
final readonly class ArithmeticCommandReader implements CommandReader
{
    public function __construct(private UnsupportedConstructs $unsupported) {}

    public function reads(TokenCursor $cursor): bool
    {
        $literal = $cursor->currentLiteral();

        return $literal !== null && str_starts_with($literal, '((');
    }

    public function read(CommandReading $reading): int
    {
        return $this->unsupported->skip($reading->context, 'An arithmetic command (( )) is not supported.', null);
    }
}
