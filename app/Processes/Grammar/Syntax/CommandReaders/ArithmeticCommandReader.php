<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Syntax\CommandReaders;

use App\Support\Syntax\TokenCursor;
use App\Values\AgentText;

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

    protected function reason(): AgentText
    {
        return AgentText::of('core.shell.arithmetic_unsupported');
    }
}
