<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A public assignment naming a record type that only Core's own writers assign, such as a desk seat.
 */
final class AssignmentTypeInternal extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forType(string $type): self
    {
        return new self("Records of type {$type} are assigned only by Core itself.");
    }

    protected function status(): int
    {
        return 403;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }
}
