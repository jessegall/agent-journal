<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\CompoundParts;
use App\Processes\Grammar\NodeRead;

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
