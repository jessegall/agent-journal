<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Processes\Grammar\Pipes\ParseWordSubstitutions;
use App\Processes\Grammar\Pipes\PlaceWord;
use App\Processes\Grammar\Pipes\RefuseArrayAssignment;
use App\Processes\Grammar\UnparsedWord;

/**
 * One word of a simple command: an array assignment start, an assignment or an argument, then its substitutions.
 *
 * @implements PipelineDefinition<UnparsedWord, UnparsedWord>
 */
final readonly class ReadWordPipeline implements PipelineDefinition
{
    public string $input = UnparsedWord::class;

    public string $output = UnparsedWord::class;

    public function pipes(): array
    {
        return [
            RefuseArrayAssignment::class,
            PlaceWord::class,
            ParseWordSubstitutions::class,
        ];
    }
}
