<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\NodeType;
use App\CommandRules\Enums\TokenType;
use App\Processes\Grammar\AndOrChain;
use App\Processes\Grammar\AndOrLink;

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
