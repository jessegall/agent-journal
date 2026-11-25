<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Processes\RetireRuleCall;
use App\Calls\Processes\RuleRetired;
use App\Commands\CommandRules\RetireCommandRule\RetireCommandRuleCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Retires a rule.
 */
final readonly class RetireRuleController
{
    public function __invoke(RetireRuleCall $call, CommandBus $commands): RuleRetired
    {
        $command = new RetireCommandRuleCommand($call->rule, $call->expectedRevision, $call->reason);

        return RuleRetired::from([
            'ruleId' => $commands->run($command),
            'state' => 'retired',
        ]);
    }
}
