<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Syntax\CommandReaders;

use App\Bus\Contracts\CommandReader;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\Pipelines\ReadKeywordFunctionPipeline;
use App\Processes\Grammar\Pipelines\ReadNamedFunctionPipeline;
use App\Processes\Grammar\Pipelines\ReadOptionStatementPipeline;
use App\Processes\Grammar\Pipelines\ReadSimpleCommandPipeline;
use App\Support\Syntax\TokenCursor;

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
