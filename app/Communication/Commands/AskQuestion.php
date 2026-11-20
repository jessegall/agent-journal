<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Communication\Enums\MessageAbility;
use App\Communication\Handlers\AskQuestionHandler;
use App\Communication\Models\Message;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Records\Support\RecordIdentity;
use Spatie\LaravelData\Attributes\Validation\Required;

/** @extends Command<string> */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(AskQuestionHandler::class)]
#[Authorize(MessagePolicy::class, MessageAbility::Work)]
#[Operation('messages_question', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class AskQuestion extends Command implements AuthorizedCommand
{
    public function __construct(
        #[Required]
        public string $body,
        public RecordIdentity|null $relatedRecord = null,
    ) {}

    /** @return class-string */
    public function subject(): string
    {
        return Message::class;
    }
}
