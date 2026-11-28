<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Agents\Contracts\RunningTools;
use App\Bus\Contracts\Pipe;
use App\Hooks\CallStages\WalkedCall;

/**
 * Keeps the tool call the agent's chat line names, by the walked hook and the decision its answer shows. It runs
 * inside the hook's transaction after the replay check, so a replay and a hook that fails change nothing.
 */
final readonly class RecordRunningTool implements Pipe
{
    public function __construct(private RunningTools $tools) {}

    public function handle(WalkedCall $walked): WalkedCall
    {
        $walked->call->input->recordTool($this->tools, $walked->call->target, $walked->answer->shownDecision());

        return $walked;
    }
}
