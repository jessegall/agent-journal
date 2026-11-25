<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * The reporting host claimed no process start with this key.
 */
final class ProcessStartUnknown extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /** @use ThrowsLater<ProcessStartUnknown> */
    use ThrowsLater;

    public static function for(string $startKey): self
    {
        return new self("This host claimed no process start {$startKey}.");
    }

    protected function status(): int
    {
        return 404;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
