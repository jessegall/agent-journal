<?php

declare(strict_types=1);

namespace App\Support\Grammar;

use App\Values\AgentText;

/**
 * A shell option statement to read as a simple command, with the reason it is not supported.
 */
final readonly class UnparsedOptionStatement
{
    public function __construct(public UnparsedCommand $toParse, public AgentText $reason) {}
}
