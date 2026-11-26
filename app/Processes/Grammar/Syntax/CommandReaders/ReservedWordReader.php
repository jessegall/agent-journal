<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Syntax\CommandReaders;

use App\Bus\Contracts\CommandReader;
use App\Bus\Contracts\Pipe;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\UnparsedCommand;
use App\Support\Syntax\TokenCursor;
use App\Values\AgentText;

/**
 * A reserved word such as then or done where a command should start makes the line invalid.
 */
final readonly class ReservedWordReader implements CommandReader, Pipe
{
    private const array RESERVED_OUT_OF_PLACE = [
        'then',
        'elif',
        'else',
        'fi',
        'do',
        'done',
        'esac',
        'in',
    ];

    public static function reads(TokenCursor $cursor): bool
    {
        return in_array($cursor->currentLiteral(), self::RESERVED_OUT_OF_PLACE, true);
    }

    /**
     * @throws ShellGrammarStopped always: the word cannot start a command
     */
    public function handle(UnparsedCommand $toParse): never
    {
        $cursor = $toParse->cursor();
        $reason = AgentText::of('core.shell.reserved_word', ['word' => $cursor->currentLiteral()]);

        throw ShellGrammarStopped::invalid($reason, $cursor->position());
    }
}
