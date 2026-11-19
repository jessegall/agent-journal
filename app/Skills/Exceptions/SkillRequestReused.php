<?php

declare(strict_types=1);

namespace App\Skills\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use RuntimeException;

final class SkillRequestReused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function for(string $requestId): self
    {
        return new self(
            "The request id {$requestId} was already used for other content; send new content under a new request id.",
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RequestKeyConflict;
    }
}
