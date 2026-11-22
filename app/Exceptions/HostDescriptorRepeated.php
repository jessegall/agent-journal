<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A host advertised one driver key twice: the report conflicts with itself, so none of it is enrolled.
 */
final class HostDescriptorRepeated extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $key): self
    {
        return new self(sprintf('The host advertised the driver %s twice, so its report is refused.', $key));
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return 409;
    }
}
