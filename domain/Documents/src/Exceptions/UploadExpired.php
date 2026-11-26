<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

final class UploadExpired extends RuntimeException implements CodedRefusal, CommandRefusal
{
    /**
     * @use ThrowsLater<UploadExpired>
     */
    use ThrowsLater;

    public static function forUpload(): self
    {
        return new self('This upload is unavailable.');
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
