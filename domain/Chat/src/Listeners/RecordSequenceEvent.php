<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\Listener;
use App\Models\Inboxes\Inbox;
use Domain\Chat\Commands\CreateChatMessage\CreateChatMessageCommand;
use Domain\Chat\Enums\ChatMessageType;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Models\SequenceRun;

/**
 * Once a sequence run's start is committed, it shows once in the follower's own chat, as an event whose card reads
 * the run.
 */
final readonly class RecordSequenceEvent implements Listener
{
    public function __construct(private CommandBus $commands) {}

    public function handle(SequenceStarted $event): void
    {
        $this->commands->run(new CreateChatMessageCommand(
            Inbox::personalOf($event->follower())->id,
            SequenceRun::LINK_TYPE,
            $event->runId(),
            ChatMessageType::Event,
        ));
    }
}
