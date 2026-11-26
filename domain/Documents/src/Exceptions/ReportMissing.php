<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * A report number that no readable report has. A number outside the reader's scope answers the same, so it reveals
 * nothing.
 */
final class ReportMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    /**
     * @use ThrowsLater<ReportMissing>
     */
    use ThrowsLater;

    public static function numbered(int $number): self
    {
        return new self("There is no report {$number} to read.");
    }

    public static function identified(string $id): self
    {
        return new self("There is no report {$id} to read.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
