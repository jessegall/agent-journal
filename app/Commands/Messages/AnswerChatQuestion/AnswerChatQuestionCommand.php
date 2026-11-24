<?php

declare(strict_types=1);

namespace App\Commands\Messages\AnswerChatQuestion;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Contracts\Bus\TargetedCommand;
use App\Enums\AccessType;
use App\Policies\MessagePolicy;
use App\Support\Command;
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
final readonly class AnswerChatQuestionCommand extends Command implements TargetedCommand
{
    public function __construct(
        public string $questionId,
        #[Required]
        public string $body,
        #[Required]
        public string $requestKey,
        public string|null $claimToken = null,
    ) {}

    public static function targetOf(string $questionId): string
    {
        return "reply:{$questionId}";
    }

    public function receiptTarget(): string
    {
        return self::targetOf($this->questionId);
    }
}
