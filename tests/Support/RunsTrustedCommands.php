<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Bus\Command;

/**
 * Runs a trusted entry's command as the journal does: as the system, through the command's own entry.
 */
trait RunsTrustedCommands
{
    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function throughEntry(Command $command): mixed
    {
        return $this->journal->throughEntry($command);
    }

    /**
     * Runs the command as the system on a fresh request: the scoped instances of the last one are forgotten first.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asSystem(Command $command): mixed
    {
        return $this->journal->asSystem($command);
    }
}
