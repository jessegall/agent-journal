<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Actors\Contracts\AgentTexts;
use App\Bus\Contracts\Pipe;
use App\Hooks\CallStages\RenderedCall;
use App\Hooks\CallStages\SettledCall;

/**
 * Renders the driver's reply to the final answer, through the adapter's renderer the call carries.
 */
final readonly class RenderReply implements Pipe
{
    public function __construct(private AgentTexts $texts) {}

    public function handle(SettledCall $settled): RenderedCall
    {
        return $settled->rendered($this->texts);
    }
}
