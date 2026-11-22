<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

final class UploadIncomplete extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forUpload(): self
    {
        return new self('The upload does not contain the declared bytes and digest.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
