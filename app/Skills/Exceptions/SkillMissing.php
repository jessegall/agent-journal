<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Values\SkillKey;
use RuntimeException;

final class SkillMissing extends RuntimeException implements CodedRefusal
{
    public static function for(SkillKey $key): self
    {
        return new self("There is no skill {$key}.");
    }

    public static function forNumber(int $number): self
    {
        return new self("There is no skill {$number}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
