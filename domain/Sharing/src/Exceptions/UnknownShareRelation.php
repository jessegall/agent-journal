<?php

declare(strict_types=1);

namespace Domain\Sharing\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A share read names a relation the record type does not declare.
 */
final class UnknownShareRelation extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $alias, string $relation): self
    {
        return new self("{$alias} declares no share relation named {$relation}.");
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
