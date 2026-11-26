<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\RetireCommandRule;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\Processes\RuleRetired;
use App\Exceptions\ClassificationRuleRefused;
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

        return $rule->id;
    }
}
