<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use App\Support\AssigneeIdentity;
use RuntimeException;
use Throwable;

final class AssigneeUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /** @use ThrowsLater<AssigneeUnavailable> */
    use ThrowsLater;

    public static function forActor(AssigneeIdentity $actor, Throwable|null $previous = null): self
    {
        return new self("The {$actor->type} {$actor->id} cannot receive work now.", 0, $previous);
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
