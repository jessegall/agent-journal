<?php

declare(strict_types=1);

namespace App\Hosts\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Hosts\Enums\HostInstructionStatus;
use RuntimeException;

/**
 * An instruction already answered or refused takes no second answer.
 */
final class HostInstructionStateRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function alreadyEnded(string $instructionId, HostInstructionStatus $status): self
    {
        return new self("Instruction {$instructionId} is {$status->value} already.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
