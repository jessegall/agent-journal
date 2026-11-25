<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

final class SkillRevisionConflict extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function latest(string $key, int $latest): self
    {
        return new self("The skill {$key} is at revision {$latest} now; read it and save against revision {$latest}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
