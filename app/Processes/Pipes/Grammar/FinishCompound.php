<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Grammar\CompoundParts;
use App\Processes\Values\Grammar\NodeRead;

/**
 * Finishes a subshell or group's node with its range and redirects.
 */
final readonly class FinishCompound implements Pipe
{
    public function handle(CompoundParts $parts): NodeRead
    {
        $parts->reading->draft()->finish($parts->node, $parts->range, [], $parts->redirects);

        return new NodeRead($parts->node);
    }
}
