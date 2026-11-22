<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadSubstitutionsPipeline;
use App\Support\Grammar\RedirectParts;
use App\Support\Grammar\SubstitutionsRead;
use App\Support\Grammar\SubstitutionsToParse;
use App\Support\PipelineAdapter;
use App\Values\Redirect;

/**
 * Reads the substitutions of a redirect through the substitutions pipeline.
 *
 * @extends PipelineAdapter<RedirectParts, SubstitutionsRead>
 */
final readonly class ParseRedirectSubstitutions extends PipelineAdapter
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
        return $input->substitutions;
    }

    protected function back(object $parsedRedirect, object $input): Redirect
    {
        return $input->redirect;
    }
}
