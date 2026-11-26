<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Bus\Contracts\Pipe;
use App\Hooks\CallStages\PreparedCall;
use App\Hooks\CallStages\RestoredCall;
use App\Stacks\StackRestorer;

/**
 * Restores the agent's stack from its locked row. The restorer holds request state, so it is asked for per call.
 */
final readonly class RestoreStack implements Pipe
{
    public function __construct(private StackRestorer $restorer) {}

    public function handle(PreparedCall $prepared): RestoredCall
    {
        return $prepared->restored($this->restorer->restore($prepared->row->frames, $prepared->row->target));
    }
}
