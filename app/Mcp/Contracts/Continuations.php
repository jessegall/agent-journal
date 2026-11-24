<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Data\NextAction;
use App\Mcp\Support\Continuation;

interface Continuations
{
    /**
     * Keeps where a read stopped, and gives the cursor that opens it again.
     */
    public function issue(Continuation $continuation): string;

    /**
     * The next action that reads on from the position with the selector of that name.
     */
    public function link(Continuation $position, string $selectorName): NextAction;

    /**
     * Where the read that issued the cursor stopped, for the tool and selector that read on.
     */
    public function open(string $cursor, string $tool, string $selector): Continuation;
}
