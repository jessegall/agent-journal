<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Pipelines\ReadRedirectPipeline;
use App\Processes\Values\Grammar\RedirectToParse;
use App\Processes\Values\Grammar\SimpleCommandDraft;
use App\Processes\Values\Redirect;

/**
 * Reads a redirect of a simple command through the redirect pipeline.
 *
 * @extends PipelineAdapter<SimpleCommandDraft, Redirect>
 */
final readonly class AttachRedirectToSimpleCommand extends PipelineAdapter
{
    protected function definition(): string
    {
        return ReadRedirectPipeline::class;
    }

    protected function produces(): string
    {
        return Redirect::class;
    }

    protected function into(object $input): RedirectToParse
    {
        return $input->toParse->redirect($input->parts->node);
    }

    protected function back(object $result, object $input): SimpleCommandDraft
    {
        return $input->withRedirect($result);
    }
}
