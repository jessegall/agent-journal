<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Grammar\ParseRedirectSubstitutions;
use App\Pipes\Grammar\ParseRedirectTarget;

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
