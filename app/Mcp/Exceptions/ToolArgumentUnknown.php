<?php

declare(strict_types=1);

namespace App\Mcp\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A tool call with an argument its tool does not declare.
 */
final class ToolArgumentUnknown extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function for(string $tool, string $argument): self
    {
        return new self("The tool {$tool} takes no argument {$argument}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
