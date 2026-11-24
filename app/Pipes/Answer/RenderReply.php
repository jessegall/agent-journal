<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Bus\Pipe;
use App\Support\CallStages\RenderedCall;
use App\Support\CallStages\SettledCall;

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
