<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\TokenType;
use App\CommandRules\Enums\WordPlace;
use App\Processes\Grammar\UnparsedWord;

/**
 * A word ending in = with a ( after it starts an array assignment, which makes its command unsupported.
 */
final readonly class RefuseArrayAssignment implements Pipe
{
    public function handle(UnparsedWord $toParse): UnparsedWord
    {
        $isArray = $toParse->cursor()->isNext(1, TokenType::OpenParen) && $toParse->word->isArrayName();

        if ($isArray) {
            return $toParse->placedAs(WordPlace::ArrayAssignment);
        }

        return $toParse;
    }
}
