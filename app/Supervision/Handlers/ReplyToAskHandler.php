<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Support\AttentionOrigin;
use App\Agents\Values\OperationKey;
use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Contracts\CommandHandler;
use App\Supervision\Commands\ReplyToAsk;
use App\Supervision\Contracts\AskAdmission;
use App\Supervision\Enums\CoreAskType;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Models\AskHop;
use App\Supervision\Support\AskRecords;
use App\Supervision\Values\AskReference;

final readonly class ReplyToAskHandler implements CommandHandler
{
    public function __construct(
        private AskRecords $asks,
        private AskAdmission $admission,
        private JournalAssignmentWriter $assignments,
        private ActorAttention $attention,
    ) {}

    public function handle(ReplyToAsk $command): AskReference
    {
        $body = trim($command->body);
        AskRefused::assertValidBody($body);
        $ask = $this->asks->lock($command->ask);
        $operation = new OperationKey(CoreAskType::Question->operation());
        $this->admission->requireCurrent($command->ask, $operation, $ask->version);

        $hop = AskHop::currentFor($ask);
        $attention = $this->attention->request($ask->requester(), AttentionOrigin::askReply($ask->id));
        $hop->answer($body, $attention->requestId ?? 'pending');
        $this->assignments->releaseForJournal($ask->assignmentIdentity());
        $ask->close();

        return $command->ask;
    }
}
