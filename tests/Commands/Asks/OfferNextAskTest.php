<?php

declare(strict_types=1);

namespace Tests\Commands\Asks;

use App\Commands\Asks\AskSupervisor\AskSupervisorCommand;
use App\Commands\Asks\OfferNextAsk\OfferNextAskCommand;
use App\Commands\Asks\ReplyToAsk\ReplyToAskCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Actors\ActorAttention;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Work\WorkProgress;
use App\Enums\Engine\NoSubject;
use App\Models\Agents\AgentStackRow;
use App\Models\Asks\AskHop;
use App\Support\ActorReference;
use App\Support\AskAttention;
use App\Support\AttentionOrigin;
use App\Support\AttentionOutcome;
use App\Support\ProfileProposal;
use App\Support\References\StateReference;
use App\Support\States\ReadyState;
use App\Support\States\Support\AnswerAskStateReference;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Support\Ticks\TickingTypes;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\TestCase;

#[TestsCommand(OfferNextAskCommand::class)]
final class OfferNextAskTest extends TestCase
{
    use CommitsHookRows;

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

    public function test_only_the_first_ask_enters_the_stack_its_close_offers_the_next_and_reply_attention_recovers_once(): void
    {
        $this->activateProfiles();
        $requester = TestStart::start('journal-worker');
        $recipient = TestStart::start('journal-code-reviewer');
        $holder = ActorReference::of($recipient->agent);
        $author = ActorReference::of($requester->agent);
        $attention = $this->mock(ActorAttention::class);
        $attention->shouldReceive('request')->withArgs(
            fn (ActorReference $actor, AttentionOrigin $origin) => $actor->isSameAs($holder),
        )->twice()->andReturn(AttentionOutcome::accepted('holder-wake', 1));
        $attention->shouldReceive('request')->withArgs(
            fn (ActorReference $actor, AttentionOrigin $origin) => $actor->isSameAs($author),
        )->twice()->andReturn(AttentionOutcome::noRuntime(), AttentionOutcome::accepted('reply-wake', 1));
        $now = CarbonImmutable::now();
        new AgentStackRow()->startFor(
            new StackTarget($recipient->agent->id, $recipient->session->id),
            new FrameRecords([
                new FrameRecord('ready', new StateReference(ReadyState::TYPE_KEY, NoSubject::None), true, 1, $now),
            ]),
            new TickingTypes([]),
        );
        $requester->startRequest($this->app);
        $this->app->instance(ActorAttention::class, $attention);
        $commands = $this->app->make(CommandBus::class);
        $first = $commands->run(new AskSupervisorCommand('First question', 'first'));
        $second = $commands->run(new AskSupervisorCommand('Next question', 'second'));
        $firstHop = AskHop::query()->where('ask_id', $first->id)->sole();
        $secondHop = AskHop::query()->where('ask_id', $second->id)->sole();
        $progress = $this->app->make(WorkProgress::class);
        $firstWork = AnswerAskStateReference::forHop($firstHop)->workReference();
        $secondWork = AnswerAskStateReference::forHop($secondHop)->workReference();
        $this->assertNotNull($progress->enteredAt($holder, $firstWork));
        $this->assertNull($progress->enteredAt($holder, $secondWork));

        $recipient->startRequest($this->app);
        $this->app->instance(ActorAttention::class, $attention);
        $this->app->make(CommandBus::class)->run(new ReplyToAskCommand($first, 'Check the input.'));
        $this->assertNotNull($progress->enteredAt($holder, $secondWork));
        $this->assertSame(AskHop::PENDING_DELIVERY, $firstHop->refresh()->attention);

        $delivery = $this->app->make(AskAttention::class);
        $delivery->recover();
        $delivery->recover();
        $this->assertSame('reply-wake', $firstHop->refresh()->attention);
    }

    private function activateProfiles(): void
    {
        $this->journal->actAsUserId(TestIds::of(1));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(ProfileProposal::fromConfiguration(
            (array) config('profiles'),
        )));
    }
}
