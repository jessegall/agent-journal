<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Pipelines\Contracts\Pipable;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\TokenCursor;

/**
 * A reader of one kind of command: a pipe or pipeline the command pipeline picks when the command at the cursor is of
 * its kind. It takes a CommandToParse and hands on the NodeRead of the command it read.
 */
interface CommandReader extends Pipable
{
    /**
     * Whether the command at the cursor is of this reader's kind.
     *
     * @throws ShellGrammarStopped
     */
    public static function reads(TokenCursor $cursor): bool;
}
