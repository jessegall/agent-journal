<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Processes\Calls\RetireRuleCall;
use App\Processes\Calls\RuleRetired;
use App\Processes\Commands\RetireCommandRule\RetireCommandRuleCommand;

/**
 * Retires a rule.
 */
final readonly class RetireRuleController
{
    public function __invoke(RetireRuleCall $call, CommandBus $commands): RuleRetired
    {
        $command = new RetireCommandRuleCommand($call->rule, $call->expectedRevision, $call->reason);

        return RuleRetired::from(['ruleId' => $commands->run($command), 'state' => 'retired']);
    }
}
