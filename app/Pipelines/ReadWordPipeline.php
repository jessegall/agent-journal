<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Grammar\ParseWordSubstitutions;
use App\Pipes\Grammar\PlaceWord;
use App\Pipes\Grammar\RefuseArrayAssignment;

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
            ParseWordSubstitutions::class,
        ];
    }
}
