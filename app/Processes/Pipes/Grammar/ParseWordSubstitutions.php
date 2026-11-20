<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadSubstitutionsPipeline;
use App\Processes\Values\Grammar\SubstitutionsRead;
use App\Processes\Values\Grammar\SubstitutionsToParse;
use App\Processes\Values\Grammar\WordToParse;

/**
 * The substitutions of an argument or assignment are read as children of its command.
 *
 * @extends PipelineAdapter<WordToParse, SubstitutionsRead>
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

    protected function into(object $input): SubstitutionsToParse
    {
        return $input->substitutions();
    }

    protected function back(object $parsedWord, object $input): WordToParse
    {
        return $input;
    }
}
