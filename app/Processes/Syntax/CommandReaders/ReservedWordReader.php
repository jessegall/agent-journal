<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Processes\Contracts\CommandReader;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Stages\Grammar\CommandReading;
use App\Processes\Syntax\TokenCursor;

/**
 * Words that only continue a construct make the line invalid at the start of a command, as in bash.
 */
final readonly class ReservedWordReader implements CommandReader
{
    private const array RESERVED_OUT_OF_PLACE = ['then', 'elif', 'else', 'fi', 'do', 'done', 'esac', 'in'];

    public function reads(TokenCursor $cursor): bool
    {
        return in_array($cursor->currentLiteral(), self::RESERVED_OUT_OF_PLACE, true);
    }

    /**
     * @throws ShellGrammarStopped always: the word cannot start a command
     */
    public function read(CommandReading $reading): never
    {
        $cursor = $reading->cursor();
        $reason = "The reserved word '{$cursor->currentLiteral()}' stands where a command should.";

        throw ShellGrammarStopped::invalid($reason, $cursor->position());
    }
}
