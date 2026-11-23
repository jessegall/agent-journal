<?php

declare(strict_types=1);

namespace App\Support\CallStages;

use App\Models\Agents\AgentStackRow;
use App\Support\Stack\HookAnswer;

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
    public function withAnswer(HookAnswer $answer): self
    {
        return clone ($this, ['answer' => $answer]);
    }

    public function rendered(): RenderedCall
    {
        return new RenderedCall($this->call, $this->row, $this->answer, ($this->call->render)($this->answer));
    }
}
