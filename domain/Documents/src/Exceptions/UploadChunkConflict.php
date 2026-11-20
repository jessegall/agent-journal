<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use RuntimeException;

final class UploadChunkConflict extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function atPosition(): self
    {
        return new self('Different text is already stored at this chunk index.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
