<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Pipelines\ReadRedirectPipeline;
use App\Support\Grammar\CompoundParts;
use App\Support\Grammar\UnparsedRedirect;
use App\Support\PipelineAdapter;
use App\Values\Redirect;

/**
 * Reads a redirect after a subshell or group through the redirect pipeline.
 *
 * @extends PipelineAdapter<CompoundParts, Redirect>
 */
final readonly class AttachRedirectToCompound extends PipelineAdapter
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
        return $input->toParse->redirect($input->node);
    }

    protected function back(object $parsedRedirect, object $input): CompoundParts
    {
        return $input->withRedirect($parsedRedirect);
    }
}
