<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Grammar\Pipes\CompleteSubstitutions;
use App\Processes\Grammar\Pipes\FindNextSubstitution;
use App\Processes\Grammar\Pipes\ParseFoundSubstitution;
use App\Processes\Grammar\Pipes\QueueWordSegments;
use App\Processes\Grammar\SubstitutionQueue;
use App\Processes\Grammar\SubstitutionsRead;
use App\Processes\Grammar\UnparsedSubstitutions;

/**
 * Reads every command and process substitution of a word as a line of its own, into children of the owner node.
 *
 * @implements PipelineDefinition<UnparsedSubstitutions, SubstitutionsRead>
 */
final readonly class ReadSubstitutionsPipeline implements PipelineDefinition
{
    public string $input = UnparsedSubstitutions::class;

    public string $output = SubstitutionsRead::class;

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
