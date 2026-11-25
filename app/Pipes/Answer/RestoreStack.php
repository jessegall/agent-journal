<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Bus\Pipe;
use App\Support\CallStages\PreparedCall;
use App\Support\CallStages\RestoredCall;
use App\Support\Stack\StackRestorer;

/**
 * Restores the agent's stack from its locked row. The restorer holds request state, so it is asked for per call.
 */
final readonly class RestoreStack implements Pipe
{
    public function __construct(private StackRestorer $restorer) {}

    public function handle(PreparedCall $prepared): RestoredCall
    {
        return $prepared->restored($this->restorer->restore($prepared->row->frames, $prepared->row->target()));
    }
}
