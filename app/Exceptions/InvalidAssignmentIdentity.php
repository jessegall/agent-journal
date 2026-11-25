<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use InvalidArgumentException;

final class InvalidAssignmentIdentity extends InvalidArgumentException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forReference(string $id): self
    {
        return new self("An assignment reference is a ULID; {$id} is not one.");
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
