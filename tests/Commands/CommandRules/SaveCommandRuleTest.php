<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\RejectRuleProposal\RejectRuleProposalCommand;
use App\Commands\CommandRules\SaveCommandRule\SaveCommandRuleCommand;
use App\Contracts\Bus\CommandClassifier;
use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\ProposalStatus;
use App\Enums\Processes\ShellDialect;
use App\Exceptions\ApprovalRefused;
use App\Exceptions\ClassificationRuleRefused;
use App\Exceptions\CommandAdmissionRefused;
use App\Models\CommandRules\RuleProposal;
use App\Support\ActiveRules;
use App\Support\Syntax\TreeParser;
use App\Values\ApprovalReceipt;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\ExecutionContext;
use App\Values\ProgramSpellings;
use App\Values\RuleScope;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A second approval on the same base fails naming the active revision, and a check saved without a request is
 * refused.
 */
#[TestsCommand(SaveCommandRuleCommand::class)]
final class SaveCommandRuleTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;

    private const string AT_REVISION = 'is at revision 1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
    }

    public function test_a_second_approval_on_the_same_base_fails_naming_the_active_revision(): void
    {
        $first = $this->saveOrdinary('save-1', 0);
        $this->assertSame(1, $first->revision);

        try {
            $this->saveOrdinary('save-2', 0);
            $this->fail('The second approval on the same base was accepted.');
        } catch (ClassificationRuleRefused $refusal) {
            $this->assertStringContainsString(self::AT_REVISION, $refusal->getMessage());
        }

        $this->assertSame(2, $this->saveOrdinary('save-3', 1)->revision);
    }

    public function test_saving_a_check_without_a_request_is_refused(): void
    {
        $save = new SaveCommandRuleCommand('save-1', AcmeDeclarations::proposedVerify(), 0, 'trusted');

        $this->assertThrows(
            fn () => $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed($save),
            ApprovalRefused::class,
        );
        $this->assertThrows(
            fn () => $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(
                new RejectRuleProposalCommand('no-such-proposal', 'none'),
            ),
            ModelNotFoundException::class,
        );
        $this->assertThrows(
            fn () => $this->journal->runAsStart(
                $this->start,
                new RejectRuleProposalCommand($this->proposalId(), 'agents cannot'),
            ),
            CommandAdmissionRefused::class,
        );
        $this->assertSame(ProposalStatus::Pending, RuleProposal::query()->sole()->status);
    }

    public function test_a_rule_of_one_project_never_classifies_a_command_of_another(): void
    {
        $this->journal->project('Shop')->idleAgent('Cy', 'main-agent', 'Shop');
        $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(
            new SaveCommandRuleCommand('save-1', AcmeDeclarations::proposed($this->tidyRule()), 0, 'reviewed'),
        );
        $this->assertCount(1, $this->app->make(ActiveRules::class)->approvedFor('tidy list'));

        $this->assertTrue($this->isKnownTo($this->start->agent->id, 'tidy list'));
        $this->assertFalse($this->isKnownTo($this->journal->agentCalled('Cy')->id, 'tidy list'));
        $this->assertTrue($this->isKnownTo($this->start->agent->id, 'tidy list'));
    }

    private function saveOrdinary(string $requestId, int $expectedActive): ApprovalReceipt
    {
        $rule = CommandRule::forProgram(
            'project.tidy.list',
            new ProgramSpellings('tidy'),
            ['list'],
            ArgumentGrammar::none(),
            CommandClassSet::of(CommandClass::Read),
        )->ownedBy(RuleScope::project(), 1);
        $proposed = AcmeDeclarations::proposed($rule);

        $save = new SaveCommandRuleCommand($requestId, $proposed, $expectedActive, 'reviewed');

        return $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed($save);
    }

    private function proposalId(): string
    {
        return RuleProposal::query()->where('command_request_id', $this->requestId)->sole()->id;
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

    /**
     * Whether the line is known to the agent, classified under the agent's own project.
     */
    private function isKnownTo(string $agentId, string $line): bool
    {
        $this->app->forgetScopedInstances();
        $this->journal->actAsAgentIds($agentId, $this->start->session->id);
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);

        $classifier = $this->app->make(CommandClassifier::class);

        return $classifier->classify($tree, ExecutionContext::inFolder(base_path()))->isKnown();
    }
}
