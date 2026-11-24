<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Bus\Pipe;
use App\Support\CallStages\SettledCall;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\SessionStarted;

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

        return $settled->withAnswer($settled->answer->withContextAdded($line->get()->text));
    }
}
