<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use RuntimeException;

final class NoteQuotaReached extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forCaller(): self
    {
        return new self('The note quota is full.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
