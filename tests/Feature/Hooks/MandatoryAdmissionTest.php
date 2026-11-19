<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Agents\Models\AgentRuntime;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Programs\ProgramReplies;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Programs\ProgramToolInput;
use App\Hooks\Stack\HookAnswer;
use App\Processes\Contracts\ShellAdmission;
use App\Processes\Models\ProcessRun;
use Closure;
use Tests\Fixtures\Hooks\CountedAdmission;
use Tests\Support\CommittedHookStack;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Core's admission runs on every shell line the frames let through, after the final answer is known and before it is
 * recorded or sent: an admitted line reaches the agent as the supervised runner's line, and a refused one is denied on
 * the stack from before the walk (doc 21 revision 6, section 10; plan 14 task 464).
 */
#[TimeLimit(seconds: 5, reason: 'Each test runs Core\'s real admission, which classifies the line by stored rules.')]
final class MandatoryAdmissionTest extends TestCase
{
    use CommittedHookStack;

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
        $this->assertSame("journal process run --admission {$run->id}", $answer->decision->replacementLine());
    }

    public function test_an_allowed_line_cannot_skip_the_admission(): void
    {
        $this->pushState(new StateReference('guide', NoSubject::None));

        $answer = $this->answerShell('acme publish --everything');

        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertStringStartsWith('command-unknown: ', $answer->decision->refusalReason());
        $this->assertSame(['acme publish --everything'], $this->admissions->lines);
    }

    public function test_a_check_without_a_proven_reader_is_denied_with_reader_required_and_its_request(): void
    {
        $answer = $this->answerShell('vendor/bin/phpstan analyse');

        $this->assertStringStartsWith('reader-required: ', $answer->decision->refusalReason());
        $this->assertStringContainsString('Request ', $answer->decision->refusalReason());
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());
    }

    public function test_a_rewritten_line_is_admitted_as_its_replacement_and_its_refusal_keeps_the_old_stack(): void
    {
        $this->pushState(new StateReference('test.rewriting', NoSubject::None));

        $answer = $this->answerShell('make docs');

        $this->assertSame(['acme publish --docs'], $this->admissions->lines);
        $this->assertSame(AnswerType::Deny, $answer->decision->answerType());
        $this->assertSame(['hooks.ready', 'test.rewriting'], $this->storedTypeKeys());
    }

    public function test_a_repeated_delivery_replays_the_recorded_answer_without_a_second_admission(): void
    {
        $first = $this->machine()->answer(...$this->shellCall('git status'));
        $second = $this->machine()->answer(...$this->shellCall('git status'));

        $this->assertSame($first->stdout, $second->stdout);
        $this->assertSame(['git status'], $this->admissions->lines);
    }

    public function test_a_program_that_cannot_take_a_rewrite_and_a_session_without_a_runtime_are_refused(): void
    {
        $program = $this->answerShell('git status', RewriteSupport::NeedsApproval);
        $this->callAs('call-2');
        AgentRuntime::query()->delete();
        $session = $this->answerShell('git status');

        $this->assertStringStartsWith('runner-unavailable: ', $program->decision->refusalReason());
        $this->assertStringContainsString('cannot take a rewritten command line', $program->decision->refusalReason());
        $this->assertStringContainsString('no runtime', $session->decision->refusalReason());
        $this->assertSame([], $this->admissions->lines);
    }

    private function answerShell(string $line, RewriteSupport $rewrites = RewriteSupport::WithoutApproval): HookAnswer
    {
        $answered = null;
        $render = function (HookAnswer $answer) use ($line, $rewrites, &$answered): ProgramReply {
            $answered = $answer;

            return $this->reply($line, $rewrites)($answer);
        };
        $deadline = new OperationDeadline(3000);
        $this->machine()->answer($this->shell($line), $this->capabilities($rewrites), $deadline, $render);

        $this->assertInstanceOf(HookAnswer::class, $answered);

        return $answered;
    }

    /**
     * @return array{0: mixed, 1: mixed, 2: OperationDeadline, 3: Closure(HookAnswer): ProgramReply}
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
     * @return Closure(HookAnswer): ProgramReply
     */
    private function reply(string $line, RewriteSupport $rewrites): Closure
    {
        $input = new ProgramToolInput(['command' => $line]);

        return fn (HookAnswer $answer) => ProgramReplies::shell($answer, $input, $rewrites);
    }
}
