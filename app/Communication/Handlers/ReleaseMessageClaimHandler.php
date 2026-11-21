<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Bus\Contracts\CommandFacts;
use App\Communication\Commands\ReleaseMessageClaim;
use App\Communication\Events\MessageClaimReleased;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Models\Message;
use App\Contracts\CommandHandler;

final readonly class ReleaseMessageClaimHandler implements CommandHandler
{
    public function __construct(
        private ResponsibilityWriter $responsibilities,
        private CommandFacts $facts,
    ) {}

    /**
     * @throws MessageMissing
     * @throws AssignmentConflict
     */
    public function handle(ReleaseMessageClaim $command): void
    {
        $message = Message::query()->acrossInboxes()->whereKey($command->messageId)->lockForUpdate()->firstOr(
            fn () => throw MessageMissing::forId($command->messageId),
        );
        $this->responsibilities->release($message->assignmentIdentity(), $command->expectedClaim);
        $this->facts->publishAfterCommit(new MessageClaimReleased($message->id, $command->expectedClaim));
    }
}
