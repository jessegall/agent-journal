<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Pipe;
use App\Support\Grammar\CompoundParts;
use App\Support\Grammar\NodeRead;

/**
 * Finishes a subshell or group's node with its range and redirects.
 */
final readonly class CloseCompoundNode implements Pipe
{
    public function handle(CompoundParts $parts): NodeRead
    {
        $parts->toParse->draft()->finish($parts->node, $parts->range, [], $parts->redirects);

        return new NodeRead($parts->node);
    }
}
