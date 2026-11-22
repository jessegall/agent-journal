<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Asks a question in a chat the author is a member of, for one named member or for anyone in it to answer; a retry
 * under the same request key answers the same question. The answer is the message id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class AskChatQuestion extends Command
{
    public function __construct(
        public string $inboxId,
        #[Required]
        public string $body,
        #[Required]
        public string $requestKey,
        public string|null $respondentText = null,
    ) {}

    /**
     * The member that must answer, written as type:id, when one is named.
     */
    public function respondent(): ActorIdentity|null
    {
        return $this->respondentText === null ? null : ActorIdentity::fromText($this->respondentText);
    }
}
