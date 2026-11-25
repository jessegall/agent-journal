<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\RejectRuleProposal\RejectRuleProposalCommand;
use App\Enums\CommandRules\ProposalStatus;
use App\Enums\CommandRules\RequestStatus;
use App\Events\Processes\RuleRejected;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\RuleProposal;
use Illuminate\Support\Facades\Event;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner rejects a proposal, which leaves the request rejected and tells its author.
 */
#[TestsCommand(RejectRuleProposalCommand::class)]
final class RejectRuleProposalTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
    }

    public function test_a_rejection_leaves_the_request_rejected_and_tells_the_author(): void
    {
        Event::fake([RuleRejected::class]);

        $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(new RejectRuleProposalCommand($this->proposalId(), 'effects are wider than read'));

        $this->assertSame(RequestStatus::Rejected, $this->request()->status);
        $this->assertSame(ProposalStatus::Rejected, RuleProposal::query()->sole()->status);
        Event::assertDispatched(
            RuleRejected::class,
            fn (RuleRejected $rejected) => $rejected->reason === 'effects are wider than read',
        );
        $this->assertSame(0, ClassificationRule::query()->count());
    }

    private function proposalId(): string
    {
        return RuleProposal::query()->where('command_request_id', $this->requestId)->sole()->id;
    }
}
