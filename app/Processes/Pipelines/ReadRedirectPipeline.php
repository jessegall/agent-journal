<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Grammar\ParseRedirectSubstitutions;
use App\Processes\Pipes\Grammar\ParseRedirectTarget;

/**
 * A redirect operator with its target word or here-document; the substitutions in either are read as children.
 */
final readonly class ReadRedirectPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            ParseRedirectTarget::class,
            ParseRedirectSubstitutions::class,
        ];
    }
}
