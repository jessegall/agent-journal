<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Grammar\CompleteSubstitutions;
use App\Pipes\Grammar\FindNextSubstitution;
use App\Pipes\Grammar\ParseFoundSubstitution;
use App\Pipes\Grammar\QueueWordSegments;
use App\Support\Grammar\SubstitutionQueue;
use App\Support\Grammar\SubstitutionsRead;
use App\Support\Grammar\UnparsedSubstitutions;
use App\Support\Step;

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
                [
                    ParseFoundSubstitution::class,
                    FindNextSubstitution::class,
                ],
                while: fn (SubstitutionQueue $queue) => $queue->hasFound()
            ),
            CompleteSubstitutions::class,
        ];
    }
}
