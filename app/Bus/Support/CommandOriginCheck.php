<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandOriginStatus;
use Closure;

/**
 * A precondition and its outcome for one submitted command instance.
 */
final class CommandOriginCheck
{
    private CommandOriginStatus $status = CommandOriginStatus::Eligible;

    /**
     * @param  Command<mixed>  $command
     * @param  Closure(): CommandOriginStatus  $check
     */
    public function __construct(private readonly Command $command, private readonly Closure $check) {}

    /**
     * @param  Command<mixed>  $command
     */
    public function permits(Command $command): bool
    {
        if ($this->command !== $command) {
            return true;
        }

        $this->status = ($this->check)();

        return $this->status === CommandOriginStatus::Eligible;
    }

    public function status(): CommandOriginStatus
    {
        return $this->status;
    }
}
