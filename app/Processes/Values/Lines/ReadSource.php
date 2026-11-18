<?php

declare(strict_types=1);

namespace App\Processes\Values\Lines;

use App\Processes\Values\ShellTree;

/**
 * A source read into the draft: the Sequence node that holds everything it contains.
 */
final readonly class ReadSource
{
    public function __construct(public ShellSource $source, public int $sequence) {}

    /**
     * The finished tree of the analysis this source belongs to, rooted at this source's sequence.
     */
    public function tree(): ShellTree
    {
        return $this->source->draft->tree($this->sequence);
    }
}
