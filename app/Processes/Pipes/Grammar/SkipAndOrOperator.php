<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\TokenType;
use App\Processes\Values\Grammar\AndOrChain;
use App\Processes\Values\Grammar\AndOrLink;

/**
 * Steps past the && or || of an and-or chain, and the newlines and comments after it.
 */
final readonly class SkipAndOrOperator implements Pipe
{
    public function handle(AndOrChain $chain): AndOrLink
    {
        $cursor = $chain->reading->cursor();
        $type = $cursor->is(TokenType::AndIf) ? NodeType::AndList : NodeType::OrList;
        $cursor->advance();
        $cursor->skip(TokenType::Newline, TokenType::Comment);

        return $chain->linkedBy($type);
    }
}
