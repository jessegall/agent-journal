<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Exceptions\SubmissionKeyInvalid;
use Illuminate\Support\Str;

/**
 * The sender's key for one message and the digest of what it sends, so a resend with the same key is the same message
 * and a different message under that key is refused.
 */
final readonly class Submission
{
    private function __construct(public string $key, public string $hash) {}

    /**
     * @throws SubmissionKeyInvalid
     */
    public static function of(
        string $key,
        string $commandType,
        ActorIdentity $recipient,
        string|null $replyToId,
        MessageBody $body,
    ): self {
        if (! Str::isUuid($key)) {
            throw SubmissionKeyInvalid::forKey($key);
        }
        $payload = json_encode([
            'command' => $commandType,
            'recipient_type' => $recipient->type->value,
            'recipient_id' => $recipient->id,
            'reply_to' => $replyToId,
            'body' => $body->text,
        ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return new self(strtolower($key), hash('sha256', $payload));
    }
}
