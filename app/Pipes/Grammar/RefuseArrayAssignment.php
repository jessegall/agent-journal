<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\TokenType;
use App\Enums\WordPlace;
use App\Support\Grammar\WordToParse;

/**
 * A word ending in = with a ( after it starts an array assignment, which makes its command unsupported.
 */
final readonly class RefuseArrayAssignment implements Pipe
{
    public function handle(WordToParse $toParse): WordToParse
    {
        $isArray = $toParse->cursor()->peekIs(1, TokenType::OpenParen) && $toParse->word->isArrayName();

        return $isArray ? $toParse->placedAs(WordPlace::ArrayAssignment) : $toParse;
    }
}
