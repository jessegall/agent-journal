<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Hooks\CallStages\SettledCall;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\SessionStarted;
use App\Pipelines\Contracts\Pipe;

/**
 * Adds the settled stack's instruction, the top live state's that has one, to a fresh session start, prompt or
 * compaction. A replay never reaches this pipe, and every other hook keeps the context its walk gave.
 */
final readonly class ComposeForeground implements Pipe
{
    private const array FRESH_INPUTS = [SessionStarted::class, PromptSubmitted::class, ContextCompacted::class];

    public function handle(SettledCall $settled): SettledCall
    {
        if (! in_array($settled->call->input::class, self::FRESH_INPUTS, true)) {
            return $settled;
        }

        $line = $settled->answer->instruction();

        if ($line->isEmpty()) {
            return $settled;
        }

        return $settled->withAnswer($settled->answer->withContextAdded($line->get()));
    }
}
