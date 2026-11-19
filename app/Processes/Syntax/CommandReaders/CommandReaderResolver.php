<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Processes\Contracts\CommandReader;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\ReadKeywordFunctionPipeline;
use App\Processes\Pipelines\ReadNamedFunctionPipeline;
use App\Processes\Pipelines\ReadOptionStatementPipeline;
use App\Processes\Pipelines\ReadSimpleCommandPipeline;
use App\Processes\Syntax\TokenCursor;

/**
 * Picks the reader for the command at the cursor: the first whose kind it is, and a simple command when none is.
 */
final class CommandReaderResolver
{
    private const array READERS = [
        CompoundCommandReader::class,
        ReservedWordReader::class,
        ReadKeywordFunctionPipeline::class,
        ArithmeticCommandReader::class,
        ReadOptionStatementPipeline::class,
        UnsupportedKeywordReader::class,
        ArrayAssignmentReader::class,
        ReadNamedFunctionPipeline::class,
    ];

    /**
     * @return class-string<CommandReader>
     *
     * @throws ShellGrammarStopped
     */
    public static function readerAt(TokenCursor $cursor): string
    {
        foreach (self::READERS as $reader) {
            if ($reader::reads($cursor)) {
                return $reader;
            }
        }

        return ReadSimpleCommandPipeline::class;
    }
}
