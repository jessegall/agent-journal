<?php

declare(strict_types=1);

namespace Tests\Commands\Asks;

use App\Commands\Asks\AskSupervisor\AskSupervisorCommand;
use App\Contracts\Actors\ActorAttention;
use App\Contracts\Asks\AskReader;
use App\Contracts\Bus\CommandBus;
use App\Models\Asks\Ask;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorReference;
use App\Support\ProfileProposal;
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
    private const string FIXTURE_ADVICE = 'Read the fixture.';

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_user_supervisor_has_a_card_without_a_runtime_wake(): void
    {
        $this->journal->owner()->activatedProfile(ProfileProposal::fromConfiguration((array) config('profiles')));
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

    public function test_the_plain_signed_cli_retains_a_question_for_the_reviewers_supervisor(): void
    {
        $this->journal->owner()->activatedProfile(ProfileProposal::fromConfiguration((array) config('profiles')));
        $start = TestStart::start('journal-code-reviewer');
        $recipient = TestStart::start('journal-main');
        $this->journal->relayAgentCommands($start);

        $this->artisan('ask:make', ['text' => 'Why does this fail?'])->assertSuccessful();
        $this->artisan('ask:list')->assertSuccessful();

        $ask = Ask::query()->ownedBy(ActorReference::of($start->agent))->firstOrFail();
        $this->artisan('ask:show', ['ask' => $ask->id])->assertSuccessful();
        $this->assertSame('question', $ask->type_key->key);
        $this->assertStringStartsWith('free:', $ask->work);
        $this->assertTrue(
            AssignmentRecord::query()->forRecord($ask->assignmentIdentity())->firstOrFail()
                ->toAssignment->holder()->isSameAs($recipient->agent->assigneeIdentity()),
        );

        $this->journal->agentCall($recipient, 'POST', '/agent/asks/reply', [
            'id' => $ask->id,
            'body' => 'Read the fixture.',
            'request_key' => 'reply-to-fixture-ask',
        ])->assertOk()->assertJsonPath('reply', self::FIXTURE_ADVICE);
        $this->assertFalse($ask->refresh()->open);

        $this->artisan('ask:make', ['text' => 'Please check another file.'])->assertSuccessful();
        $ask = Ask::query()->ownedBy(ActorReference::of($start->agent))->where('open', true)->sole();
        $this->artisan('ask:withdraw', ['ask' => $ask->id])->assertSuccessful();
        $this->assertFalse($ask->refresh()->open);
    }
}
