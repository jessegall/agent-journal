<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\RetireCommandRule\RetireCommandRuleCommand;
use App\Commands\CommandRules\SaveCommandRule\SaveCommandRuleCommand;
use App\Enums\CommandRules\CommandClass;
use App\Models\Agents\Agent;
use App\Models\CommandRules\ClassificationRule;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\ProgramSpellings;
use App\Values\RuleScope;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * Retiring a rule makes an admission queued under it refuse on its start.
 */
final class RetireCommandRuleTest extends TestCase
{
    use RefreshHookDatabase;

    private const string EXPLAIN_AGAIN = 'explain the line again';

    public function test_retiring_a_rule_makes_a_queued_admission_refuse_on_start(): void
    {
        config(['processes.runner' => true]);
        $start = $this->journal->signedStart('Test agent');
        $queued = $this->admit(ActorIdentity::ofClass(Agent::class, $start->agent->id), 'printf queued');
        $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(
            new SaveCommandRuleCommand('save-1', AcmeDeclarations::proposed($this->tidyRule()), 0, 'reviewed'),
        );

        $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(
            new RetireCommandRuleCommand(ClassificationRule::query()->sole()->id, 1, 'not needed'),
        );

        $this->assertStringStartsWith('rule-revision-changed', $queued->refresh()->stale_reason);
        $reply = $this->journal->agentCall(
            $start,
            'POST',
            "/agent/processes/admissions/{$queued->id}",
            ['request_key' => 'stale-1'],
        )->assertStatus(409);
        $this->assertStringContainsString(self::EXPLAIN_AGAIN, (string) $reply->json('message'));
    }

    private function admit(ActorIdentity $actor, string $line): ProcessRun
    {
        return ProcessRun::create(
            $actor,
            TestRunAdmissions::of(projectKey: (string) config('processes.project_key'), line: $line),
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
