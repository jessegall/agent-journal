<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\RetireRulePayload;
use App\Api\Processes\RuleRetired;
use App\Commands\CommandRules\RetireCommandRule\RetireCommandRuleCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Retires a rule.
 */
final readonly class RetireRuleController
{
    public function __invoke(RetireRulePayload $call, CommandBus $commands): RuleRetired
    {
        $command = new RetireCommandRuleCommand($call->rule, $call->expectedRevision, $call->reason);

        return RuleRetired::from([
            'ruleId' => $commands->run($command),
            'state' => 'retired',
        ]);
    }
}
