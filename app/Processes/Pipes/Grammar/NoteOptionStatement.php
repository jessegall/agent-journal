<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Grammar\CommandToParse;
use App\Processes\Values\Grammar\OptionStatementToParse;

/**
 * Notes why the shell option statement at the cursor is not supported, before it is read as a simple command.
 */
final readonly class NoteOptionStatement implements Pipe
{
    public function handle(CommandToParse $toParse): OptionStatementToParse
    {
        $reason = "The shell option statement '{$toParse->cursor()->currentLiteral()}' is not supported.";

        return new OptionStatementToParse($toParse, $reason);
    }
}
