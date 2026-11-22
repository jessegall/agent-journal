<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Decisions\MessageLine;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;

/**
 * A test state that sends its agent one message on a stop and on a file edit, and passes every other hook.
 */
final class MessagingState extends AgentState
{
    public const string TEXT = 'Task 9 waits for your review.';

    public function onFileEdit(FileEditRequested $input): MessageLine
    {
        return new MessageLine(self::TEXT);
    }

    public function onStop(StopRequested $input): MessageLine
    {
        return new MessageLine(self::TEXT);
    }
}
