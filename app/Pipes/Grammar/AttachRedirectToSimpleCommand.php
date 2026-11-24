<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadRedirectPipeline;
use App\Support\Grammar\SimpleCommandDraft;
use App\Support\Grammar\UnparsedRedirect;
use App\Support\PipelineAdapter;
use App\Values\Redirect;

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

    protected function into(object $input): UnparsedRedirect
    {
        return $input->toParse->redirect($input->parts->node);
    }

    protected function back(object $parsedRedirect, object $input): SimpleCommandDraft
    {
        return $input->withRedirect($parsedRedirect);
    }
}
