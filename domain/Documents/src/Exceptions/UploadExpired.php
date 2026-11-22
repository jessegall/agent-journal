<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

final class UploadExpired extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forUpload(): self
    {
        return new self('This upload is unavailable.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
