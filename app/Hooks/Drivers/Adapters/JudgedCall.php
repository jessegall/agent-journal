<?php

declare(strict_types=1);

namespace App\Hooks\Drivers\Adapters;

use App\Hooks\Drivers\Contracts\DriverCall;
use App\Hooks\Enums\HookEvent;
use App\Hooks\Inputs\Contracts\HookInput;
use App\Hooks\Inputs\Values\HookIdentity;
use App\Hooks\Inputs\ToolFinished;
use App\Hooks\Inputs\Values\ToolResult;
use App\Hooks\Stack\HookAnswer;
use Closure;
use App\Hooks\Drivers\DriverReplies;
use App\Hooks\Drivers\DriverReply;
use App\Hooks\Drivers\HookPayload;

/**
 * A native call the journal answers: the input for the walk, and how the program's reply is rendered from the answer.
 */
final readonly class JudgedCall implements DriverCall
{
    /**
     * @param  Closure(HookAnswer): DriverReply  $render
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
        $finishedTool = new ToolResult(
            $hookInput->toolNameText(),
            $hookInput->toolOutcome(),
            $hookInput->toolArguments(),
        );

        return new self(
            new ToolFinished($hook, $finishedTool),
            fn (HookAnswer $answer) => DriverReplies::observation(HookEvent::PostToolUse, $answer),
        );
    }

    public function replyWith(Closure $answerByJournal): DriverReply
    {
        return $answerByJournal($this->input, $this->render);
    }
}
