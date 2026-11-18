<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Contracts\CommandHandler;
use App\Processes\Commands\RetireCommandRule;
use App\Processes\Events\RuleRetired;
use App\Processes\Exceptions\ClassificationRuleRefused;
use App\Processes\Models\ClassificationRule;
use App\Processes\Support\ProjectKey;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class RetireCommandRuleHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private ProjectKey $projects,
    ) {}

    /**
     * @throws ClassificationRuleRefused
     */
    public function handle(RetireCommandRule $command): string
    {
        $rule = ClassificationRule::query()
            ->ofProject($this->projects->current())
            ->whereKey($command->classificationRuleId)
            ->lockForUpdate()
            ->sole();
        $rule->retire($command->expectedRevision, $command->reason);
        $retired = new RuleRetired($rule->project_key, $rule->rule_id, $rule->active_revision, $command->reason);
        $this->events->dispatch($retired);

        return $rule->id;
    }
}
