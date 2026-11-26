<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\Pipelines\ReadSubstitutionsPipeline;
use App\Processes\Grammar\RedirectParts;
use App\Processes\Grammar\SubstitutionsRead;
use App\Processes\Grammar\UnparsedSubstitutions;
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

    protected function into(object $input): UnparsedSubstitutions
    {
        return $input->substitutions;
    }

    protected function back(object $parsedRedirect, object $input): Redirect
    {
        return $input->redirect;
    }
}
