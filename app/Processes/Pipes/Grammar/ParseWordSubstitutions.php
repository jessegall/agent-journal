<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadSubstitutionsPipeline;
use App\Processes\Values\Grammar\SubstitutionsRead;
use App\Processes\Values\Grammar\SubstitutionsReading;
use App\Processes\Values\Grammar\WordReading;

/**
 * The substitutions of an argument or assignment are read as children of its command.
 *
 * @extends PipelineAdapter<WordReading, SubstitutionsRead>
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

    protected function into(object $input): SubstitutionsReading
    {
        return $input->substitutions();
    }

    protected function back(object $result, object $input): WordReading
    {
        return $input;
    }
}
