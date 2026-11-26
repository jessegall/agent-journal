<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\AndOrChain;
use App\Processes\Grammar\NodeRead;

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
