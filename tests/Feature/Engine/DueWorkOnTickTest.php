<?php

declare(strict_types=1);

namespace Tests\Feature\Engine;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Time\MonotonicClock;
use App\Contracts\Time\ServerClock;
use App\Enums\CommandEntry;
use App\Events\StateTypesRequested;
use App\Models\Agents\AgentStackRow;
use App\Support\ActiveActorsResolver;
use App\Support\CommandEntrance;
use App\Support\EngineAccess;
use App\Support\EnginePass;
use App\Support\Storage\FrameRecord;
use App\Support\TickDelivery;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Domains\QuestionReminders\Commands\SendQuestionReminder\SendQuestionReminderCommand;
use Tests\Fixtures\Domains\QuestionReminders\Models\Question;
use Tests\Fixtures\Domains\QuestionReminders\QuestionRemindersDomain;
use Tests\Fixtures\Domains\QuestionReminders\States\AwaitingAnswerLoader;
use Tests\Fixtures\Domains\QuestionReminders\Support\RouteHeartbeatSource;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Support\BuildsTickingStacks;
use Tests\Support\CommitsHookRows;
use Tests\Support\FakeMonotonicClock;
use Tests\Support\FakeServerClock;
use Tests\Support\InstallsCommandModules;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * Due work rechecked on tick, in a fixture domain: a question that waited long enough gets one reminder however often
 * it ticks, an answer that came first sends none and takes the frame off the stack in the same command, and a quiet
 * agent whose beats come through the heartbeat source stays present.
 */
final class DueWorkOnTickTest extends TestCase
{
    use BuildsTickingStacks;
    use CommitsHookRows;
    use InstallsCommandModules;
    use SendsSignedCalls;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'engine_frame_times',
    ];

    private const int SECOND = 1_000_000_000;

    private FakeMonotonicClock $clock;

    private FakeServerClock $serverClock;

    private CarbonImmutable $asked;

    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('reminder_questions');
        Schema::create('reminder_questions', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('text');
            $table->boolean('answered')->default(false);
            $table->timestampTz('reminded_at', 6)->nullable();
            $table->timestampsTz();
        });
        Event::listen(
            StateTypesRequested::class,
            fn (StateTypesRequested $event) => $event->registry->register(
                'test.plain',
                new ClosureStateLoader(ScriptedState::class, fn () => ScriptedState::passing()),
            ),
        );
        $this->bootModules(QuestionRemindersDomain::class);
        $this->asked = CarbonImmutable::parse('2026-11-18 12:00:00');
        $this->clock = new FakeMonotonicClock();
        $this->serverClock = new FakeServerClock($this->asked);
        $this->app->instance(MonotonicClock::class, $this->clock);
        $this->app->instance(ServerClock::class, $this->serverClock);
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('reminder_questions');

        parent::tearDown();
    }

    public function test_ticking_twice_past_the_wait_sends_one_reminder(): void
    {
        $question = Question::ask('Which database?');
        $this->tickingStack(AwaitingAnswerLoader::TYPE_KEY, [$question->id], $this->asked);

        $this->passAt(30);
        $this->assertNull($question->refresh()->reminded_at);

        $this->passAt(61);
        $this->passAt(62);

        $this->assertEquals($this->asked->addSeconds(61), $question->refresh()->reminded_at);
    }

    public function test_an_answer_before_the_tick_sends_nothing(): void
    {
        $question = Question::ask('Which database?');
        $this->tickingStack(AwaitingAnswerLoader::TYPE_KEY, [$question->id], $this->asked);
        $question->answer();

        $this->passAt(61);

        $this->assertNull($question->refresh()->reminded_at);
    }

    public function test_an_answer_before_the_reminder_sends_none_and_removes_the_frame_in_that_command(): void
    {
        $question = Question::ask('Which database?');
        $stack = $this->tickingStack(AwaitingAnswerLoader::TYPE_KEY, [$question->id], $this->asked);
        $target = new StackTarget($stack->agent_id, $stack->session_id);
        $question->answer();

        $this->app->make(EnginePass::class)->run(function () use ($target, $question): void {
            $this->app->make(EngineAccess::class)->grantFrame($target, $question->id);
            $remind = fn (): mixed => $this->app->make(CommandBus::class)->run(
                new SendQuestionReminderCommand($target, $question->id),
            );
            $this->app->make(CommandEntrance::class)->through(CommandEntry::Application, $remind);
        });

        $this->assertNull($question->refresh()->reminded_at);
        $this->assertNotContains(
            $question->id,
            array_map(
                fn (FrameRecord $frame) => $frame->id,
                AgentStackRow::query()->authorizedFor($target)->sole()->frames->all(),
            ),
        );
    }

    public function test_a_quiet_agent_beating_through_the_heartbeat_source_stays_present(): void
    {
        $this->app->forgetInstance(ServerClock::class);
        $this->app->forgetInstance(MonotonicClock::class);
        $start = TestStart::start();
        $source = new RouteHeartbeatSource(
            fn (string $path) => $this->signed(
                $start,
                $path,
                ['request_key' => bin2hex(random_bytes(8))],
            )->getStatusCode(),
        );

        $this->assertSame(0, $this->app->make(ActiveActorsResolver::class)->snapshot()->agentSessions);
        $this->assertSame(200, $source->beat());

        $this->assertSame(1, $this->app->make(ActiveActorsResolver::class)->snapshot()->agentSessions);
    }

    /**
     * One engine pass with both clocks the given number of seconds after the question was asked.
     */
    private function passAt(int $seconds): void
    {
        $this->clock->set($seconds * self::SECOND);
        $this->serverClock->set($this->asked->addSeconds($seconds));
        $start = $this->clock->nanoseconds();

        $this->app->make(EnginePass::class)->run(fn () => $this->app->make(TickDelivery::class)->deliver($start));
    }
}
