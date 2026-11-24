<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Support\Grammar\CommandToParse;
use App\Support\Grammar\OptionStatementToParse;
use App\Values\AgentText;

/**
 * Notes why the shell option statement at the cursor is not supported, before it is read as a simple command.
 */
final readonly class NoteOptionStatement implements Pipe
{
    public function handle(CommandToParse $toParse): OptionStatementToParse
    {
        $reason = AgentText::of(
            'core.shell.option_statement_unsupported',
            ['statement' => $toParse->cursor()->currentLiteral()],
        );

        return new OptionStatementToParse($toParse, $reason);
    }
}
