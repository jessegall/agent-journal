<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

final class DocumentBodyMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forInput(): self
    {
        return new self('Send exactly one of body or upload_id.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
