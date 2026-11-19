<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Bus\Support\OperationDeadline;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Exceptions\HookDeadlineExpired;
use App\Hooks\Exceptions\HookDigestChanged;
use App\Hooks\Exceptions\ReplayFound;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Lifecycle\FrameLifecycle;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\HookCall;
use App\Hooks\Programs\ProgramCapabilities;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Storage\RecordedSteps;
use App\Hooks\Support\ContextCollection;
use App\Hooks\Support\FinishedToolCalls;
use App\Hooks\Support\StackAccess;
use App\Hooks\Support\StackTransaction;
use Closure;

/**
 * Answers one hook call in one transaction: lock the stack, replay a call already answered before anything else runs,
 * or collect a compaction's reminders, run the session-start step, restore, walk the
 * stack without its finished frames, settle what the program accepts, call the lifecycle methods of the frames that
 * left, arrived or came back on top, then render and save the reply, its steps and the stack together. Nothing is
 * kept when any step fails.
 */
final readonly class AgentStateMachine
{
    public function __construct(
        private StackTransaction $transaction,
        private StackAccess $access,
        private StackRestorer $restorer,
        private HookRewrite $rewrite,
        private ContextCollection $context,
        private FrameLifecycle $lifecycle,
        private StateTypes $types,
        private SessionStartStep $sessionStart,
        private FinishedToolCalls $toolCalls,
        private HookShellAdmission $admission,
    ) {}

    /**
     * @param  Closure(HookAnswer): ProgramReply  $render  the program adapter's reply to the final answer
     */
    public function answer(HookInput $input, ProgramCapabilities $capabilities, OperationDeadline $deadline, Closure $render): ProgramReply
    {
        $capabilities->checkSupports($input->methodName());
        $identity = $this->access->hookIdentity();

        if ($deadline->hasRunOut()) {
            throw HookDeadlineExpired::forCall($identity->hookId);
        }

        $replayed = null;

        try {
            return $this->transaction->runAdmitted($this->access->target()->sessionId, $deadline, function () use ($input, $capabilities, $render, $identity, &$replayed): ProgramReply {
                $row = AgentStackRow::lockFor($this->access->target());
                $recorded = HookCall::query()->forHookId($identity->hookId)->first();

                if ($recorded !== null) {
                    $replayed = $this->replay($recorded, $identity);

                    throw ReplayFound::answeredBefore($identity->hookId);
                }

                $reminders = $this->remindersFor($input);

                $this->sessionStart->run($input, $this->access->target());
                $this->toolCalls->announce($this->access->target(), $input);

                $this->lifecycle->refuseChangeDuringCallbacks($this->access->target());
                $stackBefore = $this->restorer->restore($row->frames, $this->access->role());
                $baseline = $stackBefore->withoutInactiveFrames();
                $answer = $this->settle($baseline, $input, $capabilities)->withRemindersFirst($reminders);
                $this->lifecycle->settle($this->access->target(), $stackBefore, $answer->stack);
                $reply = $render($answer);

                $row->saveFrames($answer->stack->records(), $this->types->ticking());
                $call = new HookCall();
                $call->recordFor($identity, $reply->recordedAs($answer->decision->answerType()), RecordedSteps::of($answer->steps));
                $row->linkTo($call);

                return $reply;
            });
        } catch (ReplayFound) {
            return $replayed;
        }
    }

    /**
     * The reminders a new context start brings (launch, clear, resume or compaction), collected after the replay check
     * under the stack lock; a replay and any other hook bring none.
     *
     * @return list<string>
     */
    private function remindersFor(HookInput $input): array
    {
        return $this->context->collectReminders($this->access->target(), $input);
    }

    /**
     * The final answer as the program can take it. A shell line walks with its rewrite, and whatever the frames
     * answered, Core's mandatory admission then decides whether it runs.
     */
    private function settle(AgentStack $stack, HookInput $input, ProgramCapabilities $capabilities): HookAnswer
    {
        if ($input instanceof ShellCommandRequested) {
            $answer = $capabilities->finalAnswer($this->rewrite->answer($stack, $input), $stack);

            return $this->admission->admit($input, $answer, $stack, $capabilities);
        }

        return $capabilities->finalAnswer($stack->answer($input), $stack);
    }

    private function replay(HookCall $recorded, HookIdentity $identity): ProgramReply
    {
        if (! $recorded->isSameCallAs($identity)) {
            throw HookDigestChanged::forCall($identity->hookId);
        }

        return ProgramReply::fromRecorded($recorded->answer);
    }
}
