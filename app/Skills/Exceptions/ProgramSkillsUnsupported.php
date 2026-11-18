<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Programs\Values\ProgramKey;
use RuntimeException;

/**
 * A program the journal has no proven way to hand skills to.
 */
final class ProgramSkillsUnsupported extends RuntimeException implements CodedRefusal
{
    public static function for(ProgramKey $program): self
    {
        return new self("The journal cannot deliver skills to the program {$program->key}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Unavailable;
    }
}
