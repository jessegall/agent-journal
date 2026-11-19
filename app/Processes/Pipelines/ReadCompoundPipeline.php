<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Grammar\CloseCompound;
use App\Processes\Pipes\Grammar\FinishCompound;
use App\Processes\Pipes\Grammar\OpenCompound;
use App\Processes\Pipes\Grammar\ReadCompoundList;
use App\Processes\Pipes\Grammar\ReadCompoundRedirect;
use App\Processes\Values\Grammar\CompoundParts;

/**
 * ( list ) redirects | { list } redirects: the list inside runs through the list pipeline again, one level deeper.
 */
final readonly class ReadCompoundPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            OpenCompound::class,
            ReadCompoundList::class,
            CloseCompound::class,
            Step::repeated(ReadCompoundRedirect::class, while: fn (CompoundParts $parts) => $parts->isAtRedirect()),
            FinishCompound::class,
        ];
    }
}
