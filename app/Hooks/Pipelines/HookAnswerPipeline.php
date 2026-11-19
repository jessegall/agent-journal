<?php

declare(strict_types=1);

namespace App\Hooks\Pipelines;

use App\Hooks\Pipes\Answer\DeliverMessages;
use App\Hooks\Pipes\Answer\FindReplay;
use App\Hooks\Pipes\Answer\LockStack;
use App\Hooks\Pipes\Answer\PrepareCall;
use App\Hooks\Pipes\Answer\RenderReply;
use App\Hooks\Pipes\Answer\RestoreStack;
use App\Hooks\Pipes\Answer\SaveCall;
use App\Hooks\Pipes\Answer\SettleLifecycle;
use App\Hooks\Pipes\Answer\WalkStack;
use App\Pipelines\Contracts\PipelineDefinition;

/**
 * Answers one hook call inside its stack transaction: lock the stack, leave with a recorded reply, prepare the call,
 * restore and walk the stack, keep or hand over the states' messages, settle the frames' lifecycle, render the reply
 * and save it with the stack.
 */
final readonly class HookAnswerPipeline implements PipelineDefinition
{
    public function pipes(): array
    {
        return [
            LockStack::class,
            FindReplay::class,
            PrepareCall::class,
            RestoreStack::class,
            WalkStack::class,
            DeliverMessages::class,
            SettleLifecycle::class,
            RenderReply::class,
            SaveCall::class,
        ];
    }
}
