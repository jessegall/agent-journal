<?php

declare(strict_types=1);

namespace App\Hooks\CallStages;

use App\Actors\Contracts\AgentTexts;
use App\Models\Agents\AgentStackRow;
use App\Stacks\HookAnswer;

/**
 * A hook call whose frames that left, arrived or came back on top were told so.
 */
final readonly class SettledCall
{
    public function __construct(
        public HookCallStage $call,
        public AgentStackRow $row,
        public HookAnswer $answer,
    ) {}

    /**
     * The call with the reply the driver adapter renders from its answer.
     */
    /**
     * Whether the call came from one of these kinds of hook input.
     *
     * @param  list<class-string>  $inputs
     */
    public function isFromInputAmong(array $inputs): bool
    {
        return in_array($this->call->input::class, $inputs, true);
    }

    public function withAnswer(HookAnswer $answer): self
    {
        return clone ($this, ['answer' => $answer]);
    }

    public function rendered(AgentTexts $texts): RenderedCall
    {
        return new RenderedCall($this->call, $this->row, $this->answer, ($this->call->render)($this->answer, $texts));
    }
}
