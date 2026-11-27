<?php

declare(strict_types=1);

namespace Tests\Commands\Asks;

use App\Actors\Contracts\ActorAttention;
use App\Asks\Commands\AskSupervisor\AskSupervisorCommand;
use App\Asks\Contracts\AskReader;
use App\Bus\Contracts\CommandBus;
use App\Models\Asks\Ask;
use App\Models\Records\AssignmentRecord;
use App\Profiles\ProfileProposal;
use App\Support\ActorReference;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\TestCase;

#[TestsCommand(AskSupervisorCommand::class)]
final class AskSupervisorTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'ask_hops',
        'asks',
        'ask_requesters',
        'supervisor_changes',
        'supervisor_links',
        'assignments',
        'command_receipts',
        'session_tokens',
        'agent_sessions',
        'agents',
        'profile_revisions',
        'profiles',
        'agent_stacks',
        'tasks',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_user_supervisor_has_a_card_without_a_runtime_wake(): void
    {
        $this->journal->owner()->activatedProfile(ProfileProposal::fromConfiguration((array) config('journal.profiles')));
        $owner = $this->journal->ownerUser();
        $this->mock(ActorAttention::class)->shouldNotReceive('request');
        $requester = $this->journal->idleAgent('Requester', 'journal-main')->agentCalled('Requester');
        $this->journal->actAsAgentIds($requester->id, TestIds::of(99));

        $ask = $this->app->make(CommandBus::class)->run(new AskSupervisorCommand('Check my result.', 'owner-question'));
        $this->journal->actAs('Owner');
        $card = $this->app->make(AskReader::class)->card($ask);

        $this->assertTrue($card->isObligation);
        $this->assertSame($owner->id, $card->holderId);
    }

    public function test_a_reviewers_question_is_held_by_its_supervisor(): void
    {
        $this->journal->owner()->activatedProfile(ProfileProposal::fromConfiguration((array) config('journal.profiles')));
        $start = TestStart::start('journal-code-reviewer');
        $recipient = TestStart::start('journal-main');

        $this->journal->runAsStart($start, new AskSupervisorCommand('Why does this fail?', 'reviewer-question'));

        $ask = Ask::query()->ownedBy(ActorReference::of($start->agent))->firstOrFail();
        $this->assertSame('question', $ask->type_key->key);
        $this->assertStringStartsWith('free:', $ask->work);
        $this->assertTrue(
            AssignmentRecord::query()->forRecord($ask->assignmentIdentity())->firstOrFail()
                ->toAssignment->holder()->isSameAs($recipient->agent->assigneeIdentity()),
        );
    }
}
