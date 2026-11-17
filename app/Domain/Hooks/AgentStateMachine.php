<?php

declare(strict_types=1);

namespace App\Domain\Hooks;

use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\HookInput;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Models\AgentStackRow;
use App\Domain\Hooks\Models\HookCall;
use App\Domain\Hooks\Programs\ProgramCapabilities;
use App\Domain\Hooks\Programs\ProgramReply;
use App\Domain\Hooks\Stack\AgentStack;
use App\Domain\Hooks\Stack\HookAnswer;
use App\Domain\Hooks\Stack\HookRewrite;
use App\Domain\Hooks\Stack\StackRestorer;
use App\Domain\Hooks\Storage\RecordedSteps;
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

        return $this->transaction->runWithin($deadline, function () use ($input, $capabilities, $render, $identity): ProgramReply {
            $row = AgentStackRow::lockFor($this->access->target());
            $recorded = HookCall::query()->forHookId($identity->hookId)->first();

            if ($recorded !== null) {
                return $this->replay($recorded, $identity);
            }

            $stackBefore = $this->restorer->restore($row->frames, $this->access->role());
            $answer = $capabilities->rewrites->settle($this->walk($stackBefore, $input), $stackBefore);
            $reply = $render($answer);

            $row->saveFrames($answer->stack->records());
            (new HookCall)->recordFor($identity, $reply->recordedAs($answer->decision->answerKind()), RecordedSteps::of($answer->steps));

            return $reply;
        });
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
