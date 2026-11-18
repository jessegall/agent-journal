<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\TokenType;
use App\Processes\Enums\WordPlace;
use App\Processes\Stages\Grammar\WordReading;

/**
 * A word ending in = with a ( after it starts an array assignment, which makes its command unsupported.
 */
final readonly class RefuseArrayAssignment implements Pipe
{
    public function handle(WordReading $reading): WordReading
    {
        $isArray = $reading->cursor()->peekIs(1, TokenType::OpenParen) && $reading->word->isArrayName();

        return $isArray ? $reading->placedAs(WordPlace::ArrayAssignment) : $reading;
    }
}
