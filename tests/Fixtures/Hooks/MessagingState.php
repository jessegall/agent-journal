<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;

/**
 * A test state that sends its agent one message on a stop and on a file edit, and delegates every other hook.
 */
final class MessagingState extends AgentState
{
    public const string TEXT = 'Task 9 waits for your review.';

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return Decision::message(self::TEXT);
    }

    public function onStop(StopRequested $input): Decision
    {
        return Decision::message(self::TEXT);
    }
}
