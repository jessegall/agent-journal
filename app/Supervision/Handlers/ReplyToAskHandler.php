<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Agents\Values\OperationKey;
use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Contracts\CommandHandler;
use App\Supervision\Commands\ReplyToAsk;
use App\Supervision\Contracts\AskAdmission;
use App\Supervision\Enums\CoreAskType;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Models\AskHop;
use App\Supervision\Support\AskAttention;
use App\Supervision\Support\AskRecords;
use App\Supervision\Values\AskReference;

final readonly class ReplyToAskHandler implements CommandHandler
{
    public function __construct(
        private AskRecords $asks,
        private AskAdmission $admission,
        private JournalAssignmentWriter $assignments,
        private AskAttention $attention,
    ) {}

    public function handle(ReplyToAsk $command): AskReference
    {
        $body = trim($command->body);
        AskRefused::assertValidBody($body);
        $ask = $this->asks->lock($command->ask);
        $operation = new OperationKey(CoreAskType::Question->operation());
        $this->admission->requireCurrent($command->ask, $operation, $ask->version);

        $hop = AskHop::currentFor($ask);
        $this->attention->retainReply($ask, $hop, $body);
        $this->assignments->releaseForJournal($ask->assignmentIdentity());
        $ask->close();
        $this->attention->finishAnswering($hop->holder());

        return $command->ask;
    }
}
