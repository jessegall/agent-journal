<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Hooks;

use App\Actors\Contracts\AgentTexts;
use App\Agents\Drivers\Contracts\DriverCall;
use App\Hooks\Enums\HookEvent;
use App\Stacks\HookAnswer;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\ToolResult;
use Closure;

/**
 * A native call the journal answers: the input for the walk, and how the driver's reply is rendered from the answer.
 */
final readonly class JudgedCall implements DriverCall
{
    /**
     * @param  Closure(HookAnswer, AgentTexts): DriverReply  $render
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
            fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::observation(
                HookEvent::PostToolUse,
                $answer,
                $texts,
            ),
        );
    }

    public function replyWith(Closure $answerByJournal): DriverReply
    {
        return $answerByJournal($this->input, $this->render);
    }
}
