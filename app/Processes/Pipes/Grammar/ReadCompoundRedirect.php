<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadRedirectPipeline;
use App\Processes\Values\Grammar\CompoundParts;
use App\Processes\Values\Grammar\RedirectReading;
use App\Processes\Values\Redirect;

/**
 * Reads a redirect after a subshell or group through the redirect pipeline.
 *
 * @extends PipelineAdapter<CompoundParts, Redirect>
 */
final readonly class ReadCompoundRedirect extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadRedirectPipeline::class;
    }

    protected function produces(): string
    {
        return Redirect::class;
    }

    protected function into(object $input): RedirectReading
    {
        return $input->reading->redirect($input->node);
    }

    protected function back(object $result, object $input): CompoundParts
    {
        return $input->withRedirect($result);
    }
}
