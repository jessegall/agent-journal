<?php

declare(strict_types=1);

namespace App\Support;

use App\Data\Terminals\ScreenFrameData;
use App\Data\Terminals\StoredScreenData;
use Carbon\CarbonImmutable;

/**
 * What the cache keeps of one runtime's screen: the newest admitted screen with its identity, and the streams it
 * replaced, whose delayed reports are never admitted again.
 */
final readonly class ScreenSlot
{
    /**
     * How many replaced streams a slot remembers.
     */
    public const int RETIRED_STREAM_LIMIT = 16;

    /**
     * @param  list<string>  $retiredStreams
     */
    public function __construct(
        public ReceivedScreen $screen,
        public array $retiredStreams,
    ) {}

    public static function first(ReceivedScreen $screen): self
    {
        return new self($screen, []);
    }

    /**
     * Whether a report of the identity and sequence may replace this slot's screen: never one of a retired stream, an
     * older process generation or a lower privacy revision of the same host process, and within one stream only a
     * strictly higher sequence.
     */
    public function admits(ReceivedScreen $arriving): bool
    {
        $stored = $this->screen->identity;
        $identity = $arriving->identity;

        if (in_array($identity->streamName(), $this->retiredStreams, true)) {
            return false;
        }

        if ($identity->registration->processGeneration < $stored->registration->processGeneration) {
            return false;
        }

        if (! $identity->isSameHostProcessAs($stored)) {
            return true;
        }

        if ($identity->privacyRevision < $stored->privacyRevision) {
            return false;
        }

        return ! $identity->isSameStreamAs($stored) || $arriving->frame->sequence > $this->screen->frame->sequence;
    }

    /**
     * The slot holding the arriving screen in place of this one's, in one write: a new stream retires the one it
     * replaced.
     */
    public function replacedBy(ReceivedScreen $arriving): self
    {
        $stored = $this->screen->identity;

        if ($arriving->identity->isSameStreamAs($stored)) {
            return new self($arriving, $this->retiredStreams);
        }

        $retired = [...$this->retiredStreams, $stored->streamName()];

        return new self($arriving, array_slice($retired, -self::RETIRED_STREAM_LIMIT));
    }

    /**
     * The slot's screen when it belongs to the registration the reader expects; a mismatch shows no pixels.
     */
    public function screenFor(ScreenRegistration $expected): ReceivedScreen|null
    {
        if (! $this->screen->identity->registration->isSameAs($expected)) {
            return null;
        }

        return $this->screen;
    }

    /**
     * The slot as the cache keeps it.
     */
    public function stored(): StoredScreenData
    {
        $registration = $this->screen->identity->registration;

        return new StoredScreenData(
            $registration->runtimeId,
            $registration->hostId,
            $registration->processGeneration,
            $this->screen->frame->asReported(),
            $this->screen->receivedAt->toIso8601ZuluString('microsecond'),
            $this->retiredStreams,
        );
    }

    /**
     * The slot the cache kept.
     */
    public static function fromStored(StoredScreenData $stored): self
    {
        $registration = new ScreenRegistration($stored->runtimeId, $stored->hostId, $stored->processGeneration);
        $frame = ScreenFrameData::from($stored->frame);

        $screen = new ReceivedScreen(
            $frame,
            ScreenIdentity::ofReport($registration, $frame),
            CarbonImmutable::parse($stored->receivedAt),
        );

        return new self($screen, $stored->retiredStreams);
    }
}
