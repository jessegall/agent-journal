<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Accounts\Enums\CommandEntry;

/**
 * Runs a command as the journal itself, through its entry under a named trusted entry, for work no actor asked for,
 * such as a listener's own command after a fact committed.
 */
interface JournalCommands
{
    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    public function runAsJournal(CommandEntry $entry, string $trustedEntry, Command $command): mixed;
}
