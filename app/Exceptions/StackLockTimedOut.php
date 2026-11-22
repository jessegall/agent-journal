<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;
use Throwable;

/**
 * A stack operation that could not run in time: its stack stayed held by another operation, or the operation ran past
 * its deadline and was rolled back. The caller may send it again shortly.
 */
final class StackLockTimedOut extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function after(int $milliseconds, Throwable $cause): self
    {
        return new self(
            "The stack operation did not finish within {$milliseconds} ms and was rolled back.",
            previous: $cause,
        );
    }

    public static function spent(int $milliseconds): self
    {
        return new self(
            "The operation's time ran out {$milliseconds} ms ago, before the command could start or run again.",
        );
    }

    public static function held(int $milliseconds, Throwable $cause): self
    {
        return new self(
            "The stack stayed busy with another operation for {$milliseconds} ms; send the call again shortly.",
            previous: $cause,
        );
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Busy;
    }
}
