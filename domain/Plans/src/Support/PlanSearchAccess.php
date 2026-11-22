<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Support\ReadToolSearchAccess;
use Domain\Plans\Support\Mcp\PlanReadResult;

/**
 * Who may search plans: an agent whose grant holds plans_read for at least one plan, limited to those, and every
 * signed-in user of the environment; a hit opens through plans_read.
 */
final readonly class PlanSearchAccess extends ReadToolSearchAccess
{
    protected function readName(): string
    {
        return PlanReadResult::TOOL;
    }

    protected function idArgument(): string
    {
        return PlanReadResult::ID_ARGUMENT;
    }
}
