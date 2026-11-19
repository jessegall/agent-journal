<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Contracts\CommandReader;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\CommandToParse;

/**
 * A reserved word such as then or done where a command should start makes the line invalid.
 */
final readonly class ReservedWordReader implements CommandReader, Pipe
{
    private const array RESERVED_OUT_OF_PLACE = ['then', 'elif', 'else', 'fi', 'do', 'done', 'esac', 'in'];

    public static function reads(TokenCursor $cursor): bool
    {
        return in_array($cursor->currentLiteral(), self::RESERVED_OUT_OF_PLACE, true);
    }

    /**
     * @throws ShellGrammarStopped always: the word cannot start a command
     */
    public function handle(CommandToParse $toParse): never
    {
        $cursor = $toParse->cursor();
        $reason = "The reserved word '{$cursor->currentLiteral()}' stands where a command should.";

        throw ShellGrammarStopped::invalid($reason, $cursor->position());
    }
}
