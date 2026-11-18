<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Processes\Contracts\CommandReader;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\TokenCursor;

/**
 * Picks the reader for the command at the cursor: the first that reads it, and a simple command when none does.
 */
final readonly class CommandReaderResolver
{
    /**
     * @var list<CommandReader>
     */
    private array $readers;

    public function __construct(
        CompoundCommandReader $compound,
        ReservedWordReader $reservedWord,
        KeywordFunctionReader $keywordFunction,
        ArithmeticCommandReader $arithmetic,
        OptionStatementReader $optionStatement,
        UnsupportedKeywordReader $unsupportedKeyword,
        ArrayAssignmentReader $arrayAssignment,
        NamedFunctionReader $namedFunction,
        private SimpleCommandReader $simpleCommand,
    ) {
        $this->readers = [
            $compound,
            $reservedWord,
            $keywordFunction,
            $arithmetic,
            $optionStatement,
            $unsupportedKeyword,
            $arrayAssignment,
            $namedFunction,
        ];
    }

    /**
     * @throws ShellGrammarStopped
     */
    public function readerFor(TokenCursor $cursor): CommandReader
    {
        foreach ($this->readers as $reader) {
            if ($reader->reads($cursor)) {
                return $reader;
            }
        }

        return $this->simpleCommand;
    }
}
