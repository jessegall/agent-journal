<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

final class UploadLimitReached extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forSession(): self
    {
        return new self('This session already has four active uploads.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Busy;
    }
}
