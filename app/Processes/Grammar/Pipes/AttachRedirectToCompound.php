<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Pipelines\Support\PipelineAdapter;
use App\Processes\Grammar\CompoundParts;
use App\Processes\Grammar\Pipelines\ReadRedirectPipeline;
use App\Processes\Grammar\UnparsedRedirect;
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
