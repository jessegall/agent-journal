<?php

declare(strict_types=1);

namespace App\Hooks;

use App\Hooks\Contracts\HookDecider;
use App\Support\Decisions\Decision;
use App\Values\AgentText;
use Closure;

final class ToolBudgetDecider implements HookDecider
{
    /** @param Closure(): AgentText $reason */
    public static function answer(bool $mustActNow, Closure $reason): Decision
    {
        return $mustActNow ? Decision::deny($reason()) : Decision::delegate();
    }
}
