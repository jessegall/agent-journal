<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Enums\RefusalCode;
use App\Support\ActorIdentity;
use RuntimeException;

/**
 * A chat post addressed to, or a question asked of, someone who is not a member of the chat now: nothing is posted.
 */
final class StaleAddressee extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function forActor(ActorIdentity $actor): self
    {
        return new self("{$actor->type->value}:{$actor->id} is no longer in this chat; choose someone who is.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
