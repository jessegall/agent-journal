<?php

declare(strict_types=1);

namespace App\Support\Syntax\CommandReaders;

use App\Contracts\CommandReader;
use App\Contracts\Pipe;
use App\Enums\UnsupportedKeyword;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\CommandToParse;
use App\Support\Grammar\NodeRead;
use App\Support\Syntax\TokenCursor;
use App\Support\Syntax\UnsupportedConstructs;

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
    public function handle(CommandToParse $toParse): NodeRead
    {
        $keyword = UnsupportedKeyword::at($toParse->cursor());
        $reason = "The shell construct '{$keyword->value}' is not supported.";

        return new NodeRead($this->unsupported->skip($toParse->context, $reason, $keyword->closingKeyword()));
    }
}
