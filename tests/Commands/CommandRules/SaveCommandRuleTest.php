<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\RejectRuleProposal\RejectRuleProposalCommand;
use App\Commands\CommandRules\SaveCommandRule\SaveCommandRuleCommand;
use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\ProposalStatus;
use App\Exceptions\ApprovalRefused;
use App\Exceptions\ClassificationRuleRefused;
use App\Exceptions\CommandAdmissionRefused;
use App\Models\CommandRules\RuleProposal;
use App\Values\ApprovalReceipt;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\ProgramSpellings;
use App\Values\RuleScope;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A second approval on the same base fails naming the active revision, and a check saved without a request is
 * refused.
 */
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

        $this->assertThrows(fn () => $this->asUser($save), ApprovalRefused::class);
        $this->assertThrows(
            fn () => $this->asUser(new RejectRuleProposalCommand('no-such-proposal', 'none')),
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

        return $this->asUser($save);
    }

    private function proposalId(): string
    {
        return RuleProposal::query()->where('command_request_id', $this->requestId)->sole()->id;
    }
}
