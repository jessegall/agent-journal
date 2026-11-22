<?php

declare(strict_types=1);

namespace Domain\Rules\Support;

use App\Support\ReadToolSearchAccess;
use Domain\Rules\Mcp\Tools\RuleReadTool;

/**
 * Who may search rules: an agent whose grant holds rules_read for at least one rule, limited to those, and every
 * signed-in user of the environment; a hit opens through rules_read.
 */
final readonly class RuleSearchAccess extends ReadToolSearchAccess
{
    protected function readName(): string
    {
        return RuleReadTool::NAME;
    }

    protected function idArgument(): string
    {
        return RuleReadTool::ID_ARGUMENT;
    }
}
