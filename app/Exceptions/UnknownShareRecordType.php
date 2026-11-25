<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A share names a record type no domain registered for sharing.
 */
final class UnknownShareRecordType extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forAlias(string $alias): self
    {
        return new self("No shareable record type is registered under {$alias}.");
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
