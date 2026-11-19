<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartRefusalType;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A program name the journal has no adapter for.
 */
final class ProgramUnsupported extends InvalidArgumentException implements CommandRefusal
{
    public static function for(string $program): self
    {
        return new self("The journal cannot run the program {$program}. Name claude-code or codex.");
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::ProgramUnsupported;
    }
}
