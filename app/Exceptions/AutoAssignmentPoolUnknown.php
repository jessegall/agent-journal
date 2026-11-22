<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * An auto-assignment that names a pool no domain offers for its record type; the name is never looked up as a class.
 */
final class AutoAssignmentPoolUnknown extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forType(string $assignableType): self
    {
        return new self("No domain offers that pool for {$assignableType}; list the pools of the type to choose one.");
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
