<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Contracts\CommandReader;
use App\Processes\Enums\UnsupportedKeyword;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Syntax\UnsupportedConstructs;
use App\Processes\Values\Grammar\CommandReading;
use App\Processes\Values\Grammar\NodeRead;

/**
 * if, for, while, case and the like: a construct that is not supported, skipped up to its closing keyword as one
 * Unsupported node.
 */
final readonly class UnsupportedKeywordReader implements CommandReader, Pipe
{
    public function __construct(private UnsupportedConstructs $unsupported) {}

    public static function reads(TokenCursor $cursor): bool
    {
        return UnsupportedKeyword::startsAt($cursor);
    }

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CommandReading $reading): NodeRead
    {
        $keyword = UnsupportedKeyword::at($reading->cursor());
        $reason = "The shell construct '{$keyword->value}' is not supported.";

        return new NodeRead($this->unsupported->skip($reading->context, $reason, $keyword->closingKeyword()));
    }
}
