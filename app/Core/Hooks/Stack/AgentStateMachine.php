<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Exceptions\HookDeadlineExpired;
use App\Core\Hooks\Exceptions\HookDigestChanged;
use App\Core\Hooks\Exceptions\ReplayFound;
use App\Core\Hooks\Inputs\ContextCompacted;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Models\HookCall;
use App\Core\Hooks\Programs\ProgramCapabilities;
use App\Core\Hooks\Programs\ProgramReply;
use App\Core\Hooks\Storage\RecordedSteps;
use App\Core\Hooks\Support\Compaction;
use App\Core\Hooks\Support\OperationDeadline;
use App\Core\Hooks\Support\StackAccess;
use App\Core\Hooks\Support\StackTransaction;
use Closure;

/**
 * Answers one hook call in one transaction: lock the stack, replay a call already answered, or restore, walk,
 * render and save the reply, its steps and the stack together. Nothing is kept when any step fails.
 */
final readonly class AgentStateMachine
{
    public function __construct(
        private StackTransaction $transaction,
        private StackAccess $access,
        private StackRestorer $restorer,
        private HookRewrite $rewrite,
        private Compaction $compaction,
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
            return $this->transaction->runWithin($deadline, function () use ($input, $capabilities, $render, $identity, &$replayed): ProgramReply {
                $reminders = $this->remindersFor($input);
                $row = AgentStackRow::lockFor($this->access->target());
                $recorded = HookCall::query()->forHookId($identity->hookId)->first();

                if ($recorded !== null) {
                    $replayed = $this->replay($recorded, $identity);

                    throw ReplayFound::answeredBefore($identity->hookId);
                }

                $stackBefore = $this->restorer->restore($row->frames, $this->access->role());
                $settled = $capabilities->finalAnswer($this->walk($stackBefore, $input), $stackBefore);
                $answer = $settled->withRemindersFirst($reminders);
                $reply = $render($answer);

                $row->saveFrames($answer->stack->records());
                $call = new HookCall;
                $call->recordFor($identity, $reply->recordedAs($answer->decision->answerKind()), RecordedSteps::of($answer->steps));
                $row->linkTo($call);

                return $reply;
            });
        } catch (ReplayFound) {
            return $replayed;
        }
    }

    /**
     * The reminders a compaction brings, read before the stack lock; any other hook brings none.
     *
     * @return list<string>
     */
    private function remindersFor(HookInput $input): array
    {
        if (! $input instanceof ContextCompacted) {
            return [];
        }

        return $this->compaction->collectReminders($this->access->target(), $input->compactionId());
    }

    private function walk(AgentStack $stack, HookInput $input): HookAnswer
    {
        if ($input instanceof ShellCommandRequested) {
            return $this->rewrite->answer($stack, $input);
        }

        return $stack->answer($input);
    }

    private function replay(HookCall $recorded, HookIdentity $identity): ProgramReply
    {
        if (! $recorded->isSameCallAs($identity)) {
            throw HookDigestChanged::forCall($identity->hookId);
        }

        return ProgramReply::fromRecorded($recorded->answer);
    }
}
