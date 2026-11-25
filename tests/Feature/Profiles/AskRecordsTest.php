<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Agents\ChangeSupervisor\ChangeSupervisorCommand;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\AskRefused;
use App\Exceptions\SupervisorRouteInvalid;
use App\Models\Agents\Agent;
use App\Models\Asks\Ask;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\AskTypeRegistry;
use App\Support\ProfileProposal;
use App\Values\AskTypeKey;
use App\Values\SupervisorTarget;
use Domain\Tasks\TasksDomain;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\TestCase;

final class AskRecordsTest extends TestCase
{
    use CommitsHookRows;

    private const string FIXTURE_ADVICE = 'Read the fixture.';

    private const array TABLES = [
        'ask_hops', 'asks', 'ask_requesters', 'supervisor_changes', 'supervisor_links',
        'assignments', 'command_receipts', 'session_tokens', 'agent_sessions', 'agents', 'profile_revisions', 'profiles',
        'agent_stacks', 'tasks',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_registry_refuses_an_unknown_or_duplicate_ask_type(): void
    {
        $registry = $this->app->make(AskTypeRegistry::class);
        $question = $registry->get(AskTypeKey::of('question'));

        $this->assertSame(15, $question->allowance()->i);
        $this->assertThrows(fn () => $registry->register($question), AskRefused::class);
        $this->assertThrows(fn () => $registry->get(AskTypeKey::of('imaginary')), SupervisorRouteInvalid::class);
    }

    public function test_the_plain_signed_cli_retains_a_question_for_the_reviewers_supervisor(): void
    {
        $this->journal->owner()->activatedProfile(ProfileProposal::fromConfiguration((array) config('profiles')));
        $start = TestStart::start('journal-code-reviewer');
        $recipient = TestStart::start('journal-main');
        $this->journal->relayAgentCommands($start);

        $this->artisan('ask:make', ['text' => 'Why does this fail?'])->assertSuccessful();
        $this->artisan('ask:list')->assertSuccessful();

        $ask = Ask::query()->ownedBy(ActorIdentity::of($start->agent))->firstOrFail();
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
        $ask = Ask::query()->ownedBy(ActorIdentity::of($start->agent))->where('open', true)->sole();
        $this->artisan('ask:withdraw', ['ask' => $ask->id])->assertSuccessful();
        $this->assertFalse($ask->refresh()->open);
    }

    public function test_the_owner_sees_the_ask_card_on_the_inbox_page(): void
    {
        $this->journal->owner()->activatedProfile(ProfileProposal::fromConfiguration((array) config('profiles')));
        $requester = Agent::create('Requester', 'journal-main', $this->localProject());
        $owner = $this->journal->ownerUser();
        $this->retainFor($requester, SupervisorTarget::parse('owner'));

        $this->actingAs($owner)->get('/web/asks')->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page->component('web/Asks')
                ->where('page.data.cards.0.body', 'Where does this fail?')
                ->where('page.data.cards.0.isOpen', true),
        );
    }

    private function retainFor(Agent $requester, SupervisorTarget $target, int $routeVersion = 0): Ask
    {
        $actor = ActorIdentity::of($requester);
        $type = $this->app->make(AskTypeRegistry::class)->get(AskTypeKey::of('question'));
        $this->app->make(CommandBus::class)->run(
            new ChangeSupervisorCommand($actor, $target, $routeVersion, $type->key()),
        );
        $reference = Ask::resolveNewReference();

        return Ask::create(
            $reference,
            $actor,
            $type->key(),
            'submission',
            'Where does this fail?',
            $type->resolver()->resolve($type->subject(), $reference, null),
            $target,
        );
    }
}
