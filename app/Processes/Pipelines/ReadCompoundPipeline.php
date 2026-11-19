<?php

declare(strict_types=1);

namespace App\Processes\Pipelines;

use App\Pipelines\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Pipes\Grammar\AttachRedirectToCompound;
use App\Processes\Pipes\Grammar\CloseCompoundNode;
use App\Processes\Pipes\Grammar\OpenCompoundNode;
use App\Processes\Pipes\Grammar\ParseCompoundList;
use App\Processes\Pipes\Grammar\SkipCompoundClosingToken;
use App\Processes\Values\Grammar\CompoundParts;

/**
 * ( list ) redirects | { list } redirects: the list inside runs through the list pipeline again, one level deeper.
 */
final readonly class ReadCompoundPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            OpenCompoundNode::class,
            ParseCompoundList::class,
            SkipCompoundClosingToken::class,
            Step::repeated(AttachRedirectToCompound::class,
                while: fn (CompoundParts $parts) => $parts->isAtRedirect()
            ),
            CloseCompoundNode::class,
        ];
    }
}
