<?php

declare(strict_types=1);

namespace Tests\Machinery\Engine;

use App\Accounts\Enums\CommandEntry;
use App\Bus\CommandEntrance;
use App\Bus\Contracts\CommandBus;
use App\Engine\EngineAccess;
use App\Engine\EnginePass;
use App\Events\Hooks\StateTypesRequested;
use App\Models\Agents\AgentStackRow;
use App\Providers\DomainEventServiceProvider;
use App\Stacks\Decisions\StateReferenceKeys;
use App\Stacks\StateLoading\RegisteredStateType;
use App\Support\Storage\FrameRecord;
use App\Time\Contracts\MonotonicClock;
use App\Time\Contracts\ServerClock;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Rules\RulesDomain;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Domains\QuestionReminders\Commands\SendQuestionReminder\SendQuestionReminderCommand;
use Tests\Fixtures\Domains\QuestionReminders\Events\QuestionAnswered;
use Tests\Fixtures\Domains\QuestionReminders\Models\Question;
use Tests\Fixtures\Domains\QuestionReminders\QuestionRemindersDomain;
use Tests\Fixtures\Domains\QuestionReminders\States\AwaitAnswerStateReference;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Support\BuildsTickingStacks;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\FakeMonotonicClock;
use Tests\Support\FakeServerClock;
use Tests\Support\InstallsCommandModules;
use Tests\TestCase;

/**
 * Due work rechecked on tick, in a fixture domain: a question that waited long enough gets one reminder however often
 * it ticks, an answer that came first sends none and takes the frame off the stack in the same command, and a quiet
 * agent whose beats come through the heartbeat source stays present.
 */
#[TestsMachinery(EngineAccess::class)]
final class DueWorkOnTickTest extends TestCase
{
    use BuildsTickingStacks;
    use CommitsHookRows;
    use InstallsCommandModules;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'engine_frame_times',
    ];

    /**
     * Rules, which the Notes test module requires.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

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
                RegisteredStateType::named('test.plain', ScriptedState::class),
            ),
        );
        $this->app->bind(ScriptedState::class, fn () => ScriptedState::passing());
        $this->bootModules(QuestionRemindersDomain::class);
        new DomainEventServiceProvider($this->app)->boot();
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

    public function test_an_answer_before_the_reminder_sends_none_and_removes_the_frame_in_that_command(): void
    {
        $question = Question::ask('Which database?');
        $stack = $this->tickingStack(
            StateReferenceKeys::of(AwaitAnswerStateReference::class),
            [$question->id],
            $this->asked,
            subjectValue: 'questionId',
        );
        $target = new StackTarget($stack->agent_id, $stack->session_id);
        $question->answer();
        $this->app->make(Dispatcher::class)->dispatch(new QuestionAnswered($question->id));

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
}
