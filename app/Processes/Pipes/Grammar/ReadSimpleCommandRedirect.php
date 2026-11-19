<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadRedirectPipeline;
use App\Processes\Values\Grammar\RedirectReading;
use App\Processes\Values\Grammar\SimpleCommandReading;
use App\Processes\Values\Redirect;

/**
 * Reads a redirect of a simple command through the redirect pipeline.
 *
 * @extends PipelineAdapter<SimpleCommandReading, Redirect>
 */
final readonly class ReadSimpleCommandRedirect extends PipelineAdapter
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
        return $input->reading->redirect($input->parts->node);
    }

    protected function back(object $result, object $input): SimpleCommandReading
    {
        return $input->withRedirect($result);
    }
}
