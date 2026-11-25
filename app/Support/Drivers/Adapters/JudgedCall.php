<?php

declare(strict_types=1);

namespace App\Support\Drivers\Adapters;

use App\Contracts\Actors\AgentTexts;
use App\Enums\Hooks\HookEvent;
use App\Support\Drivers\Contracts\DriverCall;
use App\Support\Drivers\DriverReplies;
use App\Support\Drivers\DriverReply;
use App\Support\Drivers\HookPayload;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\ToolResult;
use App\Support\Stack\HookAnswer;
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
