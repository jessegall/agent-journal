<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Grammar\ParseWordSubstitutions;
use App\Pipes\Grammar\PlaceWord;
use App\Pipes\Grammar\RefuseArrayAssignment;
use App\Support\Grammar\UnparsedWord;

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
