<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use RuntimeException;

/**
 * The admitted run went stale before anything took it, so it starts nothing; the message says why.
 */
final class RunAdmissionStale extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function because(string $reason): self
    {
        return new self($reason);
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
