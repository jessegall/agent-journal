<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\TargetedCommand;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Communication\Policies\MessagePolicy;
use App\Operations\Enums\AccessType;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Answers a message from its destination inbox, naming the state version the replier saw; the answer goes back to
 * the message's source inbox. The answer is the reply's id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Effect(CommandEffectType::Recovery)]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class ReplyToMessage extends Command implements TargetedCommand
{
    public function __construct(
        public string $messageId,
        public int|null $expectedStateVersion,
        #[Required]
        public string $body,
        public string|null $agent = null,
    ) {}

    /**
     * What a reply to this message writes to, as its receipt keeps it.
     */
    public static function targetOf(string $messageId): string
    {
        return "reply:{$messageId}";
    }

    public function receiptTarget(): string
    {
        return self::targetOf($this->messageId);
    }
}
