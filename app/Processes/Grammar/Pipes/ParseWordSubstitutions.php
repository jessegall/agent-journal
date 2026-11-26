<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\Pipelines\ReadSubstitutionsPipeline;
use App\Processes\Grammar\SubstitutionsRead;
use App\Processes\Grammar\UnparsedSubstitutions;
use App\Processes\Grammar\UnparsedWord;

/**
 * The substitutions of an argument or assignment are read as children of its command.
 *
 * @extends PipelineAdapter<UnparsedWord, SubstitutionsRead>
 */
final readonly class ParseWordSubstitutions extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadSubstitutionsPipeline::class;
    }

    protected function produces(): string
    {
        return SubstitutionsRead::class;
    }

    protected function into(object $input): UnparsedSubstitutions
    {
        return $input->substitutions();
    }

    protected function back(object $parsedWord, object $input): UnparsedWord
    {
        return $input;
    }
}
