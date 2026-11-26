<?php

declare(strict_types=1);

namespace App\Hooks\Pipelines;

use App\Agents\Drivers\Hooks\DriverReply;
use App\Bus\Contracts\PipelineDefinition;
use App\Hooks\CallStages\HookCallStage;
use App\Hooks\CallStages\RestoredCall;
use App\Hooks\CallStages\WalkedCall;
use App\Hooks\Pipes\Answer\ComposeForeground;
use App\Hooks\Pipes\Answer\FindReplay;
use App\Hooks\Pipes\Answer\HandOverWaitingMessages;
use App\Hooks\Pipes\Answer\KeepMessagesAndWake;
use App\Hooks\Pipes\Answer\KeepRepeatedClosingWordsPrivate;
use App\Hooks\Pipes\Answer\LockStack;
use App\Hooks\Pipes\Answer\OfferClosingWords;
use App\Hooks\Pipes\Answer\PrepareCall;
use App\Hooks\Pipes\Answer\PublishHookEffects;
use App\Hooks\Pipes\Answer\RenderReply;
use App\Hooks\Pipes\Answer\RestoreStack;
use App\Hooks\Pipes\Answer\SaveCall;
use App\Hooks\Pipes\Answer\WalkStack;
use App\Pipelines\Support\Step;

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
