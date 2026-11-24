<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\Decisions\MessageLine;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use Tests\Support\TestText;

/**
 * A test state that sends its agent one message on a stop and on a file edit, and passes every other hook.
 */
final class MessagingState extends AgentState
{
    public const string TEXT = 'Task 9 waits for your review.';

    public function onFileEdit(FileEditRequested $input): MessageLine
    {
        return new MessageLine(TestText::of(self::TEXT));
    }

    public function onStop(StopRequested $input): MessageLine
    {
        return new MessageLine(TestText::of(self::TEXT));
    }
}
