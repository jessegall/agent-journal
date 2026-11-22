<?php

declare(strict_types=1);

namespace App\Calls\Hooks;

use App\Contracts\PipelineRunner;
use App\Exceptions\HookDeadlineExpired;
use App\Pipelines\AnswerHookPipeline;
use App\Support\CallStages\HookCallStage;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReply;
use App\Support\Drivers\Exceptions\ReplayFound;
use App\Support\IncomingWorkList;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\OperationDeadline;
use App\Support\Stack\HookAnswer;
use App\Support\StackAccess;
use App\Support\StackTransaction;
use App\Support\StateEvents\StateEventActivity;
use Closure;

/**
 * Answers one hook call: accepts the incoming work, then runs AnswerHookPipeline in one admitted stack transaction.
 * A call answered before leaves that transaction with its recorded reply, and nothing is kept when any step fails.
 */
final readonly class AgentStateMachine
{
    public function __construct(
        private StackTransaction $transaction,
        private StackAccess $access,
        private IncomingWorkList $incomingWork,
        private PipelineRunner $pipelines,
        private StateEventActivity $eventActivity,
    ) {}

    /**
     * @param  Closure(HookAnswer): DriverReply  $render  the driver adapter's reply to the final answer
     */
    public function answer(
        HookInput $input,
        DriverCapabilities $capabilities,
        OperationDeadline $deadline,
        Closure $render,
    ): DriverReply {
        $capabilities->assertSupports($input->methodName());
        $identity = $this->access->hookIdentity();

        if ($deadline->hasRunOut()) {
            throw HookDeadlineExpired::forCall($identity->hookId);
        }

        $this->incomingWork->acceptAll();
        $target = $this->access->target();
        $call = new HookCallStage($input, $capabilities, $render, $identity, $target);

        try {
            return $this->transaction->runAdmittedForTarget(
                $target,
                $deadline,
                fn (): DriverReply => $this->eventActivity->evaluate(
                    $target,
                    fn (): DriverReply => $this->pipelines->run(AnswerHookPipeline::class, $call, DriverReply::class),
                ),
            );
        } catch (ReplayFound $replay) {
            return $replay->reply;
        }
    }
}
