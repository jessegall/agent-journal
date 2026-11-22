<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Answers a waiting chat question with a reply and closes it; an agent presents the claim on its turn. The
 * answer is the reply's id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class AnswerChatQuestion extends Command
{
    public function __construct(
        public string $questionId,
        #[Required]
        public string $body,
        #[Required]
        public string $requestKey,
        public string|null $claimToken = null,
    ) {}
}
