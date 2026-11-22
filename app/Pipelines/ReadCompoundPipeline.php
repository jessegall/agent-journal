<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\PipelineDefinition;
use App\Pipes\Grammar\AttachRedirectToCompound;
use App\Pipes\Grammar\CloseCompoundNode;
use App\Pipes\Grammar\OpenCompoundNode;
use App\Pipes\Grammar\ParseCompoundList;
use App\Pipes\Grammar\SkipCompoundClosingToken;
use App\Support\Grammar\CompoundParts;
use App\Support\Step;

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
            Step::repeated(
                AttachRedirectToCompound::class,
                while: fn (CompoundParts $parts) => $parts->isAtRedirect()
            ),
            CloseCompoundNode::class,
        ];
    }
}
