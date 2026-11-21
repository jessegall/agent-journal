<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use Carbon\CarbonImmutable;
use Domain\Chat\Data\DockCursorData;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Contracts\Encryption\Encrypter;
use JsonException;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use Spatie\LaravelData\Exceptions\CannotCreateData;

/**
 * Where the next page of a conversation's dock starts: after the last placement read, or at its end. It travels
 * encrypted and signed, bound to the viewer and the conversation, and expires; the end reads like any other place.
 */
final readonly class DockCursor
{
    public const int LIFETIME_MINUTES = 60;

    private function __construct(
        public string $viewer,
        public string $conversation,
        public string|null $assignedAt,
        public string|null $placementId,
        public bool $ended,
    ) {}

    public static function start(string $viewer, string $conversation): self
    {
        return new self($viewer, $conversation, null, null, false);
    }

    public static function after(
        string $viewer,
        string $conversation,
        CarbonImmutable $assignedAt,
        string $placementId,
    ): self {
        return new self($viewer, $conversation, $assignedAt->format('Y-m-d H:i:s.uP'), $placementId, false);
    }

    public static function end(string $viewer, string $conversation): self
    {
        return new self($viewer, $conversation, null, null, true);
    }

    /**
     * The place a token names, when it is whole, unexpired and was given to this viewer for this conversation.
     *
     * @return Option<self>
     */
    public static function read(Encrypter $encrypter, string $token, string $viewer, string $conversation): Option
    {
        try {
            $place = DockCursorData::from(json_decode($encrypter->decryptString($token), true, 4, JSON_THROW_ON_ERROR));
        } catch (DecryptException|JsonException|CannotCreateData) {
            return None::create();
        }

        $issuedHere = $place->viewer === $viewer && $place->conversation === $conversation;

        if (! $issuedHere || $place->expires < CarbonImmutable::now()->getTimestamp()) {
            return None::create();
        }

        return Some::create(new self($viewer, $conversation, $place->assignedAt, $place->placementId, $place->ended));
    }

    public function token(Encrypter $encrypter): string
    {
        return $encrypter->encryptString(DockCursorData::from([
            'viewer' => $this->viewer,
            'conversation' => $this->conversation,
            'assignedAt' => $this->assignedAt,
            'placementId' => $this->placementId,
            'ended' => $this->ended,
            'expires' => CarbonImmutable::now()->addMinutes(self::LIFETIME_MINUTES)->getTimestamp(),
        ])->toJson());
    }
}
