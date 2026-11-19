<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Grammar\CommandReading;
use App\Processes\Values\Grammar\OptionStatementReading;

/**
 * Notes why the shell option statement at the cursor is not supported, before it is read as a simple command.
 */
final readonly class NoteOptionStatement implements Pipe
{
    public function handle(CommandReading $reading): OptionStatementReading
    {
        $reason = "The shell option statement '{$reading->cursor()->currentLiteral()}' is not supported.";

        return new OptionStatementReading($reading, $reason);
    }
}
