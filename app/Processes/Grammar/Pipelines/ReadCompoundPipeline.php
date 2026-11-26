<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Pipelines\Support\Step;
use App\Processes\Grammar\CompoundParts;
use App\Processes\Grammar\NodeRead;
use App\Processes\Grammar\Pipes\AttachRedirectToCompound;
use App\Processes\Grammar\Pipes\CloseCompoundNode;
use App\Processes\Grammar\Pipes\OpenCompoundNode;
use App\Processes\Grammar\Pipes\ParseCompoundList;
use App\Processes\Grammar\Pipes\SkipCompoundClosingToken;
use App\Processes\Grammar\UnparsedCompound;

/**
 * ( list ) redirects | { list } redirects: the list inside runs through the list pipeline again, one level deeper.
 *
 * @implements PipelineDefinition<UnparsedCompound, NodeRead>
 */
final readonly class ReadCompoundPipeline implements PipelineDefinition
{
    public string $input = UnparsedCompound::class;

    public string $output = NodeRead::class;

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
