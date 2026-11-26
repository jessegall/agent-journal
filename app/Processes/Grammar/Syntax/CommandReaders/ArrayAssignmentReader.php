<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Syntax\CommandReaders;

use App\CommandRules\Enums\TokenType;
use App\Support\Syntax\TokenCursor;
use App\Values\AgentText;

/**
 * name=( ... ): an array assignment is not supported.
 */
final readonly class ArrayAssignmentReader extends UnsupportedCommandReader
{
    public static function reads(TokenCursor $cursor): bool
    {
        return $cursor->is(TokenType::Word)
            && $cursor->isNext(1, TokenType::OpenParen)
            && $cursor->word(AgentText::of('core.shell.word_missing'))->isArrayName();
    }

    protected function reason(): AgentText
    {
        return AgentText::of('core.shell.array_assignment_unsupported');
    }
}
