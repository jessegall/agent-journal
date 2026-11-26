<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\RetireCommandRule;

use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Exceptions\ClassificationRuleRefused;
use App\Events\Processes\RuleRetired;
use App\Models\CommandRules\ClassificationRule;

final readonly class RetireCommandRuleHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    /**
     * @throws ClassificationRuleRefused
     */
    public function handle(RetireCommandRuleCommand $command): string
    {
        $rule = ClassificationRule::query()
            ->whereKey($command->classificationRuleId)
            ->lockForUpdate()
            ->sole();

        $rule->retire($command->expectedRevision, $command->reason);
        $retired = RuleRetired::forRule($rule, $command->reason);
        $this->facts->publishAfterCommit($retired);

        return $rule->getKey();
    }
}
