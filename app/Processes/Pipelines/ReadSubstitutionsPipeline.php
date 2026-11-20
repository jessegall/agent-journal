<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Grammar\CompleteSubstitutions;
use App\Processes\Pipes\Grammar\FindNextSubstitution;
use App\Processes\Pipes\Grammar\ParseFoundSubstitution;
use App\Processes\Pipes\Grammar\QueueWordSegments;
use App\Processes\Values\Grammar\SubstitutionQueue;

/**
 * Reads every command and process substitution of a word as a line of its own, into children of the owner node.
 */
final readonly class ReadSubstitutionsPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            QueueWordSegments::class,
            FindNextSubstitution::class,
            Step::repeated(
                [ParseFoundSubstitution::class, FindNextSubstitution::class],
                while: fn (SubstitutionQueue $queue) => $queue->hasFound()
            ),
            CompleteSubstitutions::class,
        ];
    }
}
