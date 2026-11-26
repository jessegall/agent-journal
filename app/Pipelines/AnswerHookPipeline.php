<?php

declare(strict_types=1);

namespace App\Pipelines;

use App\Agents\Drivers\Hooks\DriverReply;
use App\Contracts\Bus\PipelineDefinition;
use App\Pipes\Answer\ComposeForeground;
use App\Pipes\Answer\FindReplay;
use App\Pipes\Answer\HandOverWaitingMessages;
use App\Pipes\Answer\KeepMessagesAndWake;
use App\Pipes\Answer\KeepRepeatedClosingWordsPrivate;
use App\Pipes\Answer\LockStack;
use App\Pipes\Answer\OfferClosingWords;
use App\Pipes\Answer\PrepareCall;
use App\Pipes\Answer\PublishHookEffects;
use App\Pipes\Answer\RenderReply;
use App\Pipes\Answer\RestoreStack;
use App\Pipes\Answer\SaveCall;
use App\Pipes\Answer\WalkStack;
use App\Support\CallStages\HookCallStage;
use App\Support\CallStages\RestoredCall;
use App\Support\CallStages\WalkedCall;
use App\Support\Step;

/**
 * Answers one hook call inside its stack transaction: lock the stack, leave with a recorded reply, prepare the call,
 * restore and walk the stack, keep or hand over the states' messages, settle the frames' lifecycle, render the reply
 * and save it with the stack.
 *
 * @implements PipelineDefinition<HookCallStage, DriverReply>
 */
final readonly class AnswerHookPipeline implements PipelineDefinition
{
    public string $input = HookCallStage::class;

    public string $output = DriverReply::class;

    public function pipes(): array
    {
        return [
            LockStack::class,
            FindReplay::class,
            PrepareCall::class,
            RestoreStack::class,
            KeepRepeatedClosingWordsPrivate::class,
            Step::chosen(
                fn (RestoredCall $restored) => OfferClosingWords::isNeeded($restored),
                OfferClosingWords::class,
                WalkStack::class,
            ),
            Step::chosen(
                fn (WalkedCall $walked) => $walked->leavesMessagesWithIdleAgent(),
                KeepMessagesAndWake::class,
                HandOverWaitingMessages::class,
            ),
            PublishHookEffects::class,
            ComposeForeground::class,
            RenderReply::class,
            SaveCall::class,
        ];
    }
}
