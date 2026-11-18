<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Grammar\ReadSubstitutions;

/**
 * The command and process substitutions of a word, each read as a line of its own through the analysis pipeline.
 */
final readonly class ReadSubstitutionsPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            ReadSubstitutions::class,
        ];
    }
}
