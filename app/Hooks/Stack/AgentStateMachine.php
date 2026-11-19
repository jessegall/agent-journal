<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Bus\Support\OperationDeadline;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Exceptions\HookDeadlineExpired;
use App\Hooks\Exceptions\ReplayFound;
use App\Hooks\Pipelines\HookAnswerPipeline;
use App\Hooks\Programs\ProgramCapabilities;
use App\Hooks\Programs\ProgramReply;
use App\Hooks\Support\IncomingWorkList;
use App\Hooks\Support\StackAccess;
use App\Hooks\Support\StackTransaction;
use App\Hooks\Values\Answer\HookCallStage;
use App\Pipelines\Contracts\RunsPipelines;
use Closure;

/**
 * Answers one hook call: accepts the incoming work, then runs HookAnswerPipeline in one admitted stack transaction.
 * A call answered before leaves that transaction with its recorded reply, and nothing is kept when any step fails.
 */
final readonly class AgentStateMachine
{
    public function __construct(
        private StackTransaction $transaction,
        private StackAccess $access,
        private IncomingWorkList $incomingWork,
        private RunsPipelines $pipelines,
    ) {}

    /**
     * @param  Closure(HookAnswer): ProgramReply  $render  the program adapter's reply to the final answer
     */
    public function answer(
        HookInput $input,
        ProgramCapabilities $capabilities,
        OperationDeadline $deadline,
        Closure $render,
    ): ProgramReply {
        $capabilities->checkSupports($input->methodName());
        $identity = $this->access->hookIdentity();

        if ($deadline->hasRunOut()) {
            throw HookDeadlineExpired::forCall($identity->hookId);
        }

        $this->incomingWork->acceptAll();
        $target = $this->access->target();
        $call = new HookCallStage($input, $capabilities, $render, $identity, $target);

        try {
            return $this->transaction->runAdmitted(
                $target->sessionId,
                $deadline,
                fn (): ProgramReply => $this->pipelines->run(HookAnswerPipeline::class, $call, ProgramReply::class),
            );
        } catch (ReplayFound $replay) {
            return $replay->reply;
        }
    }
}
