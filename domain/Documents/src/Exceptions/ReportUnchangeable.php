<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A report is a snapshot of one moment and never changes; a correction is a new report that links to it.
 */
final class ReportUnchangeable extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function snapshot(): self
    {
        return new self(
            'A report is a snapshot of one moment and never changes. To correct it, file a new report that links to this one.',
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }

    protected function status(): int
    {
        return 409;
    }
}
