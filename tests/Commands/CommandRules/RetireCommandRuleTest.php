<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\CommandRules\Commands\RetireCommandRule\RetireCommandRuleCommand;
use App\CommandRules\Commands\SaveCommandRule\SaveCommandRuleCommand;
use App\CommandRules\Enums\CommandClass;
use App\CommandRules\Values\ProgramSpellings;
use App\CommandRules\Values\RuleScope;
use App\Models\Agents\Agent;
use App\Models\CommandRules\ClassificationRule;
use App\Models\Runs\ProcessRun;
use App\Support\ActorReference;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * Retiring a rule makes an admission queued under it refuse on its start.
 */
#[TestsCommand(RetireCommandRuleCommand::class)]
final class RetireCommandRuleTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_retiring_a_rule_marks_a_queued_admission_stale(): void
    {
        config(['journal.processes.runner' => true]);
        $start = $this->journal->owner()->signedStart('Test agent');
        $queued = $this->admit(ActorReference::ofClass(Agent::class, $start->agent->id), 'printf queued');
        $this->journal->asOwner(
            new SaveCommandRuleCommand('save-1', AcmeDeclarations::proposed($this->tidyRule()), 0, 'reviewed'),
        );

        $this->journal->asOwner(
            new RetireCommandRuleCommand(ClassificationRule::query()->sole()->id, 1, 'not needed'),
        );

        $this->assertStringStartsWith('rule-revision-changed', $queued->refresh()->stale_reason);
    }

    private function admit(ActorReference $actor, string $line): ProcessRun
    {
        return ProcessRun::create(
            $actor,
            TestRunAdmissions::of(line: $line),
        );
    }

    private function tidyRule(): CommandRule
    {
        return CommandRule::forProgram(
            'project.tidy.list',
            new ProgramSpellings('tidy'),
            ['list'],
            ArgumentGrammar::none(),
            CommandClassSet::of(CommandClass::Read),
        )->ownedBy(RuleScope::project(), 1);
    }
}
