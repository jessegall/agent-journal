<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Grammar\PlaceWord;
use App\Processes\Pipes\Grammar\ReadWordSubstitutions;
use App\Processes\Pipes\Grammar\RefuseArrayAssignment;

/**
 * One word of a simple command: an array assignment start, an assignment or an argument, then its substitutions.
 */
final readonly class ReadWordPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            RefuseArrayAssignment::class,
            PlaceWord::class,
            ReadWordSubstitutions::class,
        ];
    }
}
