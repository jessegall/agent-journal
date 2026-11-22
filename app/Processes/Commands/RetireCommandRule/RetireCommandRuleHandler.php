<?php

declare(strict_types=1);

namespace App\Processes\Commands\RetireCommandRule;

use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Processes\Events\RuleRetired;
use App\Processes\Exceptions\ClassificationRuleRefused;
use App\Processes\Models\ClassificationRule;
use App\Processes\Support\ProjectKey;

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
