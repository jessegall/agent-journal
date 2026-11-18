<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Stages\Grammar\CommandReading;
use App\Processes\Syntax\TokenCursor;

/**
 * Reads one kind of shell command: a subshell, a function definition, an unsupported construct or a simple command.
 */
interface CommandReader
{
    /**
     * Whether the command at the cursor is of this reader's kind.
     *
     * @throws ShellGrammarStopped
     */
    public function reads(TokenCursor $cursor): bool;

    /**
     * Reads the command at the cursor into the draft and returns its node.
     *
     * @throws ShellGrammarStopped
     */
    public function read(CommandReading $reading): int;
}
