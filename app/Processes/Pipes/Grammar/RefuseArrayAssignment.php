<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\TokenType;
use App\Processes\Enums\WordPlace;
use App\Processes\Values\Grammar\WordToParse;

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
