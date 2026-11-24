<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\Listener;
use App\Models\Inboxes\Inbox;
use Domain\Chat\Commands\CreateChatMessage\CreateChatMessageCommand;
use Domain\Chat\Enums\ChatMessageType;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Models\SequenceRun;

/**
 * A sequence run its follower started shows once in the follower's own chat, as an event whose card reads the run.
 */
#[InCommandTransaction]
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
