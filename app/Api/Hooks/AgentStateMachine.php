<?php

declare(strict_types=1);

namespace App\Api\Hooks;

use App\Actors\Contracts\AgentTexts;
use App\Agents\Drivers\Capabilities\DriverCapabilities;
use App\Agents\Drivers\Hooks\DriverReply;
use App\Bus\Contracts\PipelineRunner;
use App\Hooks\CallStages\HookCallStage;
use App\Hooks\Exceptions\HookDeadlineExpired;
use App\Hooks\Pipelines\AnswerHookPipeline;
use App\Hooks\StateEvents\StateEventActivity;
use App\Stacks\HookAnswer;
use App\Stacks\IncomingWorkRegistration;
use App\Stacks\StackAccess;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\StackOperationDeadline;
use App\Support\StackTransaction;
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
        private IncomingWorkRegistration $incomingWork,
        private PipelineRunner $pipelines,
        private StateEventActivity $eventActivity,
    ) {}

    /**
     * @param  Closure(HookAnswer, AgentTexts): DriverReply  $render  the driver adapter's reply to the final answer
     */
    public function answer(
        HookInput $input,
        DriverCapabilities $capabilities,
        StackOperationDeadline $deadline,
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

        return $this->transaction->runAdmittedForTarget(
            $target,
            $deadline,
            fn (): DriverReply => $this->eventActivity->evaluate(
                $target,
                fn () => $this->pipelines->run(AnswerHookPipeline::class, $call, DriverReply::class),
            ),
        );
    }
}
