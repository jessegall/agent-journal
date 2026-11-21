<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Hooks\CallStages\SettledCall;
use App\Hooks\Contracts\InstructsForeground;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Stack\AgentStack;
use App\Pipelines\Contracts\Pipe;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Adds the one foreground instruction of the settled stack to a fresh session start, prompt or compaction: the
 * highest live frame that gates the agent's work, otherwise the highest live frame that instructs. A replay never
 * reaches this pipe, and every other hook keeps the context its walk gave.
 */
final readonly class ComposeForeground implements Pipe
{
    private const array FRESH_INPUTS = [SessionStarted::class, PromptSubmitted::class, ContextCompacted::class];

    public function handle(SettledCall $settled): SettledCall
    {
        if (! in_array($settled->call->input::class, self::FRESH_INPUTS, true)) {
            return $settled;
        }

        $line = self::foregroundLine($settled->answer->stack);

        if ($line->isEmpty()) {
            return $settled;
        }

        return $settled->withAnswer($settled->answer->withContextAdded($line->get()));
    }

    /**
     * @return Option<string>
     */
    private static function foregroundLine(AgentStack $stack): Option
    {
        $instructing = None::create();

        foreach (array_reverse($stack->frames()) as $frame) {
            if (! $frame->isLive() || ! $frame->state instanceof InstructsForeground) {
                continue;
            }

            if (! $frame->state->workPermission()->allowed) {
                return Some::create($frame->state->instructionText());
            }

            if ($instructing->isEmpty()) {
                $instructing = Some::create($frame->state->instructionText());
            }
        }

        return $instructing;
    }
}
