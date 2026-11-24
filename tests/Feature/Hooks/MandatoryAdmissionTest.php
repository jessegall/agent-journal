<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Admission\ShellAdmission;
use App\Enums\AnswerType;
use App\Enums\ExecutionModeType;
use App\Enums\NoSubject;
use App\Enums\RewriteSupport;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Runs\ProcessRun;
use App\Models\Starts\SessionPolicy;
use App\Support\Drivers\DriverReplies;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\OperationDeadline;
use App\Support\References\StateReference;
use App\Support\Stack\HookAnswer;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\ProfileBase;
use App\Values\ProfileStartPolicy;
use App\Values\StartPolicy;
use App\Values\StopConditions;
use Closure;
use Tests\Fixtures\Hooks\CountedAdmission;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestText;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Core's admission runs on every shell line the frames let through, after the final answer is known and before it is
 * recorded or sent: an admitted line reaches the agent as the supervised runner's line, and a refused one is denied on
 * the stack from before the walk.
 */
#[TimeLimit(seconds: 5, reason: 'Each test runs Core\'s real admission, which classifies the line by stored rules.')]
final class MandatoryAdmissionTest extends TestCase
{
    use CommittedHookStack;

    private const string ADMITTED_LINE = 'journal process run --admission %s';

    private const string NO_REWRITE = 'cannot take a rewritten command line';

    private const string NO_RUNTIME = 'no runtime';

    private const string IMAGE = 'journal-agent@sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    private CountedAdmission $admissions;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admissions = new CountedAdmission($this->app->make(ShellAdmission::class));
        $this->app->instance(ShellAdmission::class, $this->admissions);
    }

    public function test_an_admitted_line_reaches_the_agent_as_the_supervised_runners_line(): void
    {
        $answer = $this->answerShell('git status');

        $this->assertSame(AnswerType::Rewrite, $answer->decision->answerType());
        $run = ProcessRun::query()->withoutGlobalScopes()->sole();
        $this->assertSame(sprintf(self::ADMITTED_LINE, $run->id), $answer->decision->replacementLine());
    }

    public function test_an_allowed_line_cannot_skip_the_admission(): void
    {
        $this->pushState(new StateReference('guide', NoSubject::None));

        $answer = $this->answerShell('acme publish --everything');

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertStringStartsWith('command-unknown: ', TestText::words($answer->decision->refusalReason()));
        $this->assertSame(['acme publish --everything'], $this->admissions->lines);
    }

    public function test_a_check_without_a_proven_reader_is_denied_with_reader_required_and_its_request(): void
    {
        $answer = $this->answerShell('vendor/bin/phpstan analyse');

        $this->assertStringStartsWith('reader-required: ', TestText::words($answer->decision->refusalReason()));
        $this->assertStringContainsString('Request ', TestText::words($answer->decision->refusalReason()));
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());
    }

    public function test_a_rewritten_line_is_admitted_as_its_replacement_and_its_refusal_keeps_the_old_stack(): void
    {
        $this->pushState($this->rewriting());

        $answer = $this->answerShell('make docs');

        $this->assertSame(['acme publish --docs'], $this->admissions->lines);
        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertSame(['core.ready', 'test.rewriting'], $this->storedTypeKeys());
    }

    public function test_a_repeated_delivery_replays_the_recorded_answer_without_a_second_admission(): void
    {
        $first = $this->machine()->answer(...$this->shellCall('git status'));
        $second = $this->machine()->answer(...$this->shellCall('git status'));

        $this->assertSame($first->stdout, $second->stdout);
        $this->assertSame(['git status'], $this->admissions->lines);
    }

    /**
     * A container is only where a session's lines run: the same rules judge each line, an allowed one runs there as
     * the frames answered, since no supervised runner reaches into the container, and one whose output must be kept
     * is refused until a runner does.
     */
    public function test_a_line_of_a_session_in_its_own_container_is_judged_by_the_rules_and_runs_there(): void
    {
        $this->runInItsOwnContainer();

        $known = $this->answerShell('git status');
        $this->callAs('call-2');
        $unknown = $this->answerShell('acme publish --everything');
        $this->callAs('call-3');
        $check = $this->answerShell('vendor/bin/phpstan analyse');

        $this->assertSame(AnswerType::Allow, $known->decision->answerType());
        $this->assertStringStartsWith('command-unknown: ', TestText::words($unknown->decision->refusalReason()));
        $this->assertStringStartsWith('runner-unavailable: ', TestText::words($check->decision->refusalReason()));
        $this->assertSame([], $this->admissions->lines);
        $this->assertCount(3, $this->admissions->judged);
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());
    }

    private function runInItsOwnContainer(): void
    {
        SessionPolicy::create(
            AgentSession::query()->findOrFail($this->target->sessionId),
            new StartPolicy(
                ProfileBase::mainAgent()->defaultAccess(),
                StopConditions::make([]),
                ExecutionPolicy::make(
                    ExecutionModeType::RequiredContainer,
                    self::IMAGE,
                    ProfileStartPolicy::WORKSPACE,
                    ExecutionBudgets::mainAgent(),
                    [],
                ),
                null,
                null,
                null,
            ),
        );
    }

    public function test_a_program_that_cannot_take_a_rewrite_and_a_session_without_a_runtime_are_refused(): void
    {
        $driver = $this->answerShell('git status', RewriteSupport::NeedsApproval);
        $this->callAs('call-2');
        AgentRuntime::query()->delete();
        $session = $this->answerShell('git status');

        $this->assertStringStartsWith('runner-unavailable: ', TestText::words($driver->decision->refusalReason()));
        $this->assertStringContainsString(self::NO_REWRITE, TestText::words($driver->decision->refusalReason()));
        $this->assertStringContainsString(self::NO_RUNTIME, TestText::words($session->decision->refusalReason()));
        $this->assertSame([], $this->admissions->lines);
    }

    private function answerShell(string $line, RewriteSupport $rewrites = RewriteSupport::WithoutApproval): HookAnswer
    {
        $answered = null;
        $render = function (HookAnswer $answer, AgentTexts $texts) use ($line, $rewrites, &$answered): DriverReply {
            $answered = $answer;

            return $this->reply($line, $rewrites)($answer, $texts);
        };
        $deadline = new OperationDeadline(3000);
        $this->machine()->answer($this->shell($line), $this->capabilities($rewrites), $deadline, $render);

        $this->assertInstanceOf(HookAnswer::class, $answered);

        return $answered;
    }

    /**
     * @return array{0: mixed, 1: mixed, 2: OperationDeadline, 3: Closure(HookAnswer, AgentTexts): DriverReply}
     */
    private function shellCall(string $line): array
    {
        $rewrites = RewriteSupport::WithoutApproval;

        return [
            $this->shell($line),
            $this->capabilities($rewrites),
            new OperationDeadline(3000),
            $this->reply($line, $rewrites),
        ];
    }

    /**
     * @return Closure(HookAnswer, AgentTexts): DriverReply
     */
    private function reply(string $line, RewriteSupport $rewrites): Closure
    {
        $input = new DriverToolInput(['command' => $line]);

        return fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::shell($answer, $input, $rewrites, $texts);
    }
}
