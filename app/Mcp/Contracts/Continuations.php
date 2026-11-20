<?php

declare(strict_types=1);

namespace App\Mcp\Contracts;

use App\Mcp\Data\NextAction;
use App\Mcp\Support\Continuation;

interface Continuations
{
    public function issue(Continuation $continuation): string;

    public function link(Continuation $position, string $selectorName): NextAction;

    public function open(string $cursor, string $tool, string $selector): Continuation;
}
