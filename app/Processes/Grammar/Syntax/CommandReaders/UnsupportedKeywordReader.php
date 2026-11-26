<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Syntax\CommandReaders;

use App\Bus\Contracts\CommandReader;
use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\UnsupportedKeyword;
use App\Exceptions\ShellGrammarStopped;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Syntax\UnsupportedConstructs;
use App\Processes\Grammar\UnparsedCommand;
use App\Support\Syntax\TokenCursor;
use App\Values\AgentText;

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
    public function handle(UnparsedCommand $toParse): NodeRead
    {
        $keyword = UnsupportedKeyword::at($toParse->cursor());
        $reason = AgentText::of('core.shell.construct_unsupported', ['construct' => $keyword->value]);

        return new NodeRead($this->unsupported->skip($toParse->context, $reason, $keyword->closingKeyword()));
    }
}
