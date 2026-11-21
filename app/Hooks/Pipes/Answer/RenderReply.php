<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Hooks\CallStages\RenderedCall;
use App\Hooks\CallStages\SettledCall;
use App\Pipelines\Contracts\Pipe;

/**
 * Renders the program's reply to the final answer, through the adapter's renderer the call carries.
 */
final readonly class RenderReply implements Pipe
{
    public function handle(SettledCall $settled): RenderedCall
    {
        return $settled->rendered();
    }
}
