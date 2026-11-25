<?php

declare(strict_types=1);

namespace Tests\Commands\Navigation;

use App\Commands\Navigation\AnswerNavigation\AnswerNavigationCommand;
use App\Contracts\Actors\ActorAttention;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Navigation\NavigationKey;
use App\Enums\Navigation\NavigationStatus;
use App\Exceptions\NavigationAnswerRefused;
use App\Models\Agents\Agent;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\NavigationRequest;
use App\Support\Access\AccessSettings;
use App\Support\ActorReference;
use App\Support\EnrolledHost;
use App\Support\MainInboxTakeover;
use App\Support\NavigationRounds;
use App\Values\NavigationAnswer;
use App\Values\NavigationRound;
use App\Values\OwnerAuthority;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * An agent answers a screen it was asked to pass: the occupant's round is sent once and the request is answering; a
 * stale round, another actor's round or a parameter the goal lacks stores nothing, and a control key or an endless
 * label never becomes an answer.
 */
#[TestsCommand(AnswerNavigationCommand::class)]
final class AnswerNavigationTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
        'accounts',
        'active_accounts',
        'session_processes',
        'menu_entries',
    ];

    private Agent $main;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installInboxes();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->main = $this->journal->idleAgent('Main', 'main-agent')->agentCalled('Main');
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainInboxTakeover::class)->takeOver($this->main),
        );
    }

    public function test_the_occupants_round_is_sent_once_and_the_request_is_answering(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $round = $this->answer($navigation, NavigationAnswer::keys(['down', 'down']));

        $first = $this->asAgent($this->main, $round);
        $again = $this->asAgent($this->main, $round);

        $this->assertSame($first->requestId, $again->requestId);
        $this->assertSame(1, $this->roundCount($navigation));
        $sent = DriverRequest::query()->findOrFail($first->requestId);
        $this->assertSame(DriverOperation::Navigate, $sent->operation);
        $this->assertSame(['down', 'down'], $sent->navigation_round?->toArray()['keys']);
        $this->assertSame(NavigationStatus::Answering, $navigation->fresh()?->status);
    }

    public function test_a_stale_round_another_actors_round_or_a_parameter_the_goal_lacks_stores_nothing(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $stranger = $this->journal->idleAgent('Helper', 'main-agent')->agentCalled('Helper');
        $choose = NavigationAnswer::choose('GPT-6');
        $refused = [
            'stale version' => [$this->main, new AnswerNavigationCommand($navigation->id, 9, 7, $choose)],
            'old screen' => [$this->main, new AnswerNavigationCommand($navigation->id, 1, 6, $choose)],
            'free text' => [$this->main, $this->answer($navigation, NavigationAnswer::typeParameter('shell'))],
            'another agent' => [$stranger, $this->answer($navigation, NavigationAnswer::confirm('GPT-6'))],
        ];

        foreach ($refused as $name => [$agent, $round]) {
            try {
                $this->asAgent($agent, $round);
                $this->fail("{$name} was sent.");
            } catch (NavigationAnswerRefused) {
                $this->assertSame(0, $this->roundCount($navigation), $name);
            }
        }
    }

    public function test_a_control_key_or_an_endless_label_never_becomes_an_answer(): void
    {
        $answers = [
            fn () => NavigationAnswer::keys(['ctrl-c']),
            fn () => NavigationAnswer::choose(str_repeat('a', 201)),
        ];

        foreach ($answers as $make) {
            try {
                $make();
                $this->fail('A key or label outside the allowed set became an answer.');
            } catch (NavigationAnswerRefused) {
                $this->addToAssertionCount(1);
            }
        }
    }

    public function test_a_round_is_appended_once_and_claimed_with_its_keys(): void
    {
        $attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $attention);

        [$host, $navigation] = $this->stalled();
        $round = NavigationRound::keys($navigation->id, $navigation->row_version, 7, [NavigationKey::Down]);

        $first = $this->append($navigation, $round);
        $again = $this->append($navigation, $round);

        $this->assertSame($first->id, $again->id);
        $claimed = collect(
            $this->journal->hostCall(
                $host,
                'POST',
                '/host/claim?limit=10&wait=0&watched_version=0',
            )->assertOk()->json('requests'),
        )
            ->firstWhere('requestId', $first->id);
        $this->assertSame(['navigate', $navigation->id, ['down']], [
            $claimed['operation'],
            $claimed['navigationRequestId'],
            $claimed['navigationRound']['keys'],
        ]);
    }

    public function test_the_screen_after_a_round_becomes_the_current_screen(): void
    {
        $attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $attention);

        [$host, $navigation] = $this->stalled();
        $round = $this->append($navigation, NavigationRound::choose($navigation->id, 1, 7, 'GPT-6'));

        $this->notify($host, $round, isProofSeen: false)->assertNoContent();

        $this->assertSame(['Model: GPT-6'], $navigation->fresh()?->screen->rows);
    }

    private function answer(NavigationRequest $navigation, NavigationAnswer $answer): AnswerNavigationCommand
    {
        $generation = $navigation->screen->generation;

        return new AnswerNavigationCommand($navigation->id, $navigation->row_version, $generation, $answer);
    }

    /**
     * Runs a command of the main agent's on the bus as the agent.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asAgent(Agent $agent, Command $command): mixed
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent($agent->id),
            TestStartAuthority::forAgent($agent->id),
        );

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function roundCount(NavigationRequest $navigation): int
    {
        return DriverRequest::query()->where('navigation_request_id', $navigation->id)->count();
    }

    private function append(NavigationRequest $navigation, NavigationRound $round): DriverRequest
    {
        return $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(NavigationRounds::class)->append($navigation, $round),
        );
    }

    /**
     * A key script stalled on a newly opened runtime, with its navigation request raised.
     *
     * @return array{EnrolledHost, NavigationRequest}
     */
    private function stalled(string $build = '2.1.323'): array
    {
        [$host, $opened] = $this->openRuntime(build: $build);
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']));
        $stalled = DriverRequest::query()->with('runtime')->findOrFail($receipt->requestId);

        return [$host, $this->raise($stalled, 'raise-1')];
    }

    /**
     * @param  list<array<string, mixed>>  $steps
     */
    private function notify(
        EnrolledHost $host,
        DriverRequest $round,
        bool $isProofSeen,
        array $steps = [],
    ): TestResponse {
        return $this->journal->hostCall($host, 'POST', '/host/reports/request', [
            'request_id' => $round->id,
            'attempt' => $round->fresh()?->attempt_version,
            'progress' => 'applied',
            'actual_binding' => 'navigation',
            'outcome' => null,
            'navigation' => [
                'rows' => ['Model: GPT-6'],
                'highlight' => -1,
                'generation' => 8,
                'has_observed_proof' => $isProofSeen,
                ...($steps === [] ? [] : ['steps' => $steps]),
            ],
        ]);
    }
}
