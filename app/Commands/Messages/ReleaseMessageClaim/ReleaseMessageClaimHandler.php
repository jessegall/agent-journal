<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReleaseMessageClaim;

use App\Contracts\Assignments\ResponsibilityWriter;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\Messages\MessageClaimReleased;
use App\Exceptions\AssignmentConflict;
use App\Exceptions\MessageMissing;
use App\Models\Messages\Message;
use App\Support\SpeechService;

final readonly class ReleaseMessageClaimHandler implements CommandHandler
{
    public function __construct(
        private ResponsibilityWriter $responsibilities,
        private CommandFacts $facts,
        private SpeechService $speech,
    ) {}

    /**
     * @throws MessageMissing
     * @throws AssignmentConflict
     */
    public function handle(ReleaseMessageClaimCommand $command): void
    {
        $message = Message::query()->acrossInboxes()->whereKey($command->messageId)->lockForUpdate()->firstOr(
            fn () => throw MessageMissing::forId($command->messageId),
        );

        if ($message->isChat()) {
            $this->speech->release(
                $message->destination_inbox_id,
                $command->dispatchedBy(),
                (string) $message->user_root_id,
            );

            return;
        }

        $this->responsibilities->release($message->assignmentIdentity(), $command->expectedClaim);
        $this->facts->publishAfterCommit(new MessageClaimReleased($message->id, $command->expectedClaim));
    }
}
