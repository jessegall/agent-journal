<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
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
