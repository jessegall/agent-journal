<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Contracts\HookInput;
use App\Hooks\Contracts\ProgramCall;
use App\Hooks\Enums\HookEvent;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\ToolFinished;
use App\Hooks\Inputs\ToolResult;
use App\Hooks\Stack\HookAnswer;
use Closure;

/**
 * A native call the journal answers: the input for the walk, and how the program's reply is rendered from the answer.
 */
final readonly class JudgedCall implements ProgramCall
{
    /**
     * @param  Closure(HookAnswer): ProgramReply  $render
     */
    public function __construct(
        public HookInput $input,
        public Closure $render,
    ) {}

    /**
     * A finished tool call the journal judges, answered as an observation.
     */
    public static function forFinishedTool(HookIdentity $hook, HookPayload $hookInput): self
    {
        $finishedTool = new ToolResult($hookInput->toolNameText(), $hookInput->toolOutcome(), $hookInput->toolArguments());

        return new self(
            new ToolFinished($hook, $finishedTool),
            fn (HookAnswer $answer) => ProgramReplies::observation(HookEvent::PostToolUse, $answer),
        );
    }

    public function replyWith(Closure $answerByJournal): ProgramReply
    {
        return $answerByJournal($this->input, $this->render);
    }
}
