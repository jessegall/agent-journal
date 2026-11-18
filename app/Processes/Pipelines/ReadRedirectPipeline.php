<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Processes\Pipes\Grammar\ReadRedirect;

/**
 * A redirect: its operator, its target or here-document, and the substitutions in them.
 */
final readonly class ReadRedirectPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            ReadRedirect::class,
        ];
    }
}
