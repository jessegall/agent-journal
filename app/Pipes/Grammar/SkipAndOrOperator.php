<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\CommandRules\NodeType;
use App\Enums\CommandRules\TokenType;
use App\Support\Grammar\AndOrChain;
use App\Support\Grammar\AndOrLink;

/**
 * Steps past the && or || of an and-or chain, and the newlines and comments after it.
 */
final readonly class SkipAndOrOperator implements Pipe
{
    public function handle(AndOrChain $chain): AndOrLink
    {
        $cursor = $chain->toParse->cursor();
        $type = $cursor->is(TokenType::AndIf) ? NodeType::AndList : NodeType::OrList;
        $cursor->advance();
        $cursor->skip(TokenType::Newline, TokenType::Comment);

        return $chain->linkedBy($type);
    }
}
