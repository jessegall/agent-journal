<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Enums\NodeType;
use App\Processes\Values\SourceRange;

/**
 * An and-or chain with its next && or || stepped past, waiting for the pipeline after it.
 */
final readonly class AndOrLink
{
    public function __construct(public AndOrChain $chain, public NodeType $type) {}

    /**
     * The chain joined from the left with the pipeline read after the operator.
     */
    public function joinedWith(int $pipeline): AndOrChain
    {
        $left = $this->chain->node;
        $draft = $this->chain->toParse->draft();
        $range = new SourceRange($draft->range($left)->start, $draft->range($pipeline)->end);
        $joined = $draft->add($this->type, $range, null);
        $draft->adopt($joined, $left);
        $draft->adopt($joined, $pipeline);

        return new AndOrChain($this->chain->toParse, $joined);
    }
}
