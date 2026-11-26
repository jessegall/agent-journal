<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A tool argument that is missing or not of the type its tool reads.
 */
final class ToolArgumentInvalid extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function for(string $argument, string $expected): self
    {
        return new self("The argument {$argument} must be {$expected}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
