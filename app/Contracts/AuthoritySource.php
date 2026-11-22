<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * Where the acting actor's authority comes from, installed with its identity in one step: an agent's start profile,
 * an admitted owner, or a named trusted entry of the journal itself. It is never a stand-in profile that allows all.
 */
interface AuthoritySource
{
    /**
     * The source in words, for a refusal or a log line.
     */
    public function description(): string;

    /**
     * Whether an actor under this authority may run the application's own commands at the top level; a trusted entry
     * of the journal runs only its own entry's commands.
     */
    public function mayRunApplicationCommands(): bool;
}
