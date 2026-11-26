<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\UnparsedCommand;
use App\Processes\Grammar\UnparsedOptionStatement;
use App\Values\AgentText;

/**
 * Notes why the shell option statement at the cursor is not supported, before it is read as a simple command.
 */
final readonly class NoteOptionStatement implements Pipe
{
    public function handle(UnparsedCommand $toParse): UnparsedOptionStatement
    {
        $reason = AgentText::of(
            'core.shell.option_statement_unsupported',
            ['statement' => $toParse->cursor()->currentLiteral()],
        );

        return new UnparsedOptionStatement($toParse, $reason);
    }
}
