<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadSubstitutionsPipeline;
use App\Support\Grammar\SubstitutionsRead;
use App\Support\Grammar\UnparsedSubstitutions;
use App\Support\Grammar\UnparsedWord;
use App\Support\PipelineAdapter;

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
