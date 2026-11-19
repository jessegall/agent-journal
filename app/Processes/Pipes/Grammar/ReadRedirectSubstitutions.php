<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadSubstitutionsPipeline;
use App\Processes\Values\Grammar\RedirectParts;
use App\Processes\Values\Grammar\SubstitutionsRead;
use App\Processes\Values\Grammar\SubstitutionsReading;
use App\Processes\Values\Redirect;

/**
 * Reads the substitutions of a redirect through the substitutions pipeline.
 *
 * @extends PipelineAdapter<RedirectParts, SubstitutionsRead>
 */
final readonly class ReadRedirectSubstitutions extends PipelineAdapter
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
        return $input->substitutions;
    }

    protected function back(object $result, object $input): Redirect
    {
        return $input->redirect;
    }
}
