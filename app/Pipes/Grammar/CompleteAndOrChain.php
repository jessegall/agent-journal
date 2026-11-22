<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Support\Grammar\AndOrChain;
use App\Support\Grammar\NodeRead;

/**
 * Hands on the node of a whole and-or chain.
 */
final readonly class CompleteAndOrChain implements Pipe
{
    public function handle(AndOrChain $chain): NodeRead
    {
        return new NodeRead($chain->node);
    }
}
