<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Processes\Contracts\CommandReader;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\CommandReading;

/**
 * set, shopt, setopt and unsetopt change how the shell reads what follows: read as a simple command and marked
 * unsupported.
 */
final readonly class OptionStatementReader implements CommandReader
{
    private const array OPTION_STATEMENTS = ['set', 'shopt', 'setopt', 'unsetopt'];

    public function __construct(private SimpleCommandReader $simpleCommands) {}

    public function reads(TokenCursor $cursor): bool
    {
        return in_array($cursor->currentLiteral(), self::OPTION_STATEMENTS, true);
    }

    public function read(CommandReading $reading): int
    {
        $reason = "The shell option statement '{$reading->cursor()->currentLiteral()}' is not supported.";
        $statement = $this->simpleCommands->read($reading);
        $reading->draft()->markStatementUnsupported($statement, $reason);

        return $statement;
    }
}
