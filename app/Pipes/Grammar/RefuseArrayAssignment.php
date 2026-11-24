<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\TokenType;
use App\Enums\WordPlace;
use App\Support\Grammar\UnparsedWord;

/**
 * A word ending in = with a ( after it starts an array assignment, which makes its command unsupported.
 */
final readonly class RefuseArrayAssignment implements Pipe
{
    public function handle(UnparsedWord $toParse): UnparsedWord
    {
        $isArray = $toParse->cursor()->isNext(1, TokenType::OpenParen) && $toParse->word->isArrayName();

        return $isArray ? $toParse->placedAs(WordPlace::ArrayAssignment) : $toParse;
    }
}
