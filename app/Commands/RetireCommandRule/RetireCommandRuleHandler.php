<?php

declare(strict_types=1);

namespace App\Commands\RetireCommandRule;

use App\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Events\RuleRetired;
use App\Exceptions\ClassificationRuleRefused;
use App\Models\ClassificationRule;
use App\Support\ProjectKey;

final readonly class RetireCommandRuleHandler implements CommandHandler
{
    public function __construct(
        private CommandFacts $facts,
        private ProjectKey $projects,
    ) {}

    /**
     * @throws ClassificationRuleRefused
     */
    public function handle(RetireCommandRuleCommand $command): string
    {
        $rule = ClassificationRule::query()
            ->ofProject($this->projects->current())
            ->whereKey($command->classificationRuleId)
            ->lockForUpdate()
            ->sole();

        $rule->retire($command->expectedRevision, $command->reason);
        $retired = RuleRetired::forRule($rule, $command->reason);
        $this->facts->publishAfterCommit($retired);

        return $rule->id;
    }
}
