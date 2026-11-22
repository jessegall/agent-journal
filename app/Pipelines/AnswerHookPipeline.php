<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Contracts\PipelineDefinition;
use App\Pipes\Answer\ComposeForeground;
use App\Pipes\Answer\DeliverMessages;
use App\Pipes\Answer\FindReplay;
use App\Pipes\Answer\LockStack;
use App\Pipes\Answer\PrepareCall;
use App\Pipes\Answer\PublishHookEffects;
use App\Pipes\Answer\RenderReply;
use App\Pipes\Answer\RestoreStack;
use App\Pipes\Answer\SaveCall;
use App\Pipes\Answer\WalkStack;

/**
 * Answers one hook call inside its stack transaction: lock the stack, leave with a recorded reply, prepare the call,
 * restore and walk the stack, keep or hand over the states' messages, settle the frames' lifecycle, render the reply
 * and save it with the stack.
 */
final readonly class AnswerHookPipeline implements PipelineDefinition
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
            PublishHookEffects::class,
            ComposeForeground::class,
            RenderReply::class,
            SaveCall::class,
        ];
    }
}
