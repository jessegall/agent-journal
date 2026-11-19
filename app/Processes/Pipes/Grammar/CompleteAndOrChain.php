<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Grammar\AndOrChain;
use App\Processes\Values\Grammar\NodeRead;

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
