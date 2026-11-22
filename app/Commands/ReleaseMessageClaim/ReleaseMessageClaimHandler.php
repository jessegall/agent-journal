<?php

declare(strict_types=1);

namespace App\Commands\ReleaseMessageClaim;

use App\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Contracts\ResponsibilityWriter;
use App\Events\MessageClaimReleased;
use App\Exceptions\AssignmentConflict;
use App\Exceptions\MessageMissing;
use App\Models\Message;
use App\Support\SpeechAllowance;

final readonly class ReleaseMessageClaimHandler implements CommandHandler
{
    public function __construct(
        private ResponsibilityWriter $responsibilities,
        private CommandFacts $facts,
        private SpeechAllowance $speech,
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
