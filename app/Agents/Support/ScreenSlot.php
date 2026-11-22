<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * What the cache keeps of one runtime's screen: the identity of the newest admitted report, its screen, and the
 * streams it replaced, whose delayed reports are never admitted again.
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
        public ScreenIdentity $identity,
        public ReceivedScreen $screen,
        public array $retiredStreams,
    ) {}

    public static function first(ScreenIdentity $identity, ReceivedScreen $screen): self
    {
        return new self($identity, $screen, []);
    }

    /**
     * Whether a report of the identity and sequence may replace this slot's screen: never one of a retired stream, an
     * older process generation or a lower privacy revision of the same host process, and within one stream only a
     * strictly higher sequence.
     */
    public function admits(ScreenIdentity $arriving, int $sequence): bool
    {
        if (in_array($arriving->streamName(), $this->retiredStreams, true)) {
            return false;
        }

        if ($arriving->registration->processGeneration < $this->identity->registration->processGeneration) {
            return false;
        }

        if (! $arriving->isSameHostProcessAs($this->identity)) {
            return true;
        }

        if ($arriving->privacyRevision < $this->identity->privacyRevision) {
            return false;
        }

        return ! $arriving->isSameStreamAs($this->identity) || $sequence > $this->screen->frame->sequence;
    }

    /**
     * The slot holding the arriving screen in place of this one's, in one write: a new stream retires the one it
     * replaced.
     */
    public function replacedBy(ScreenIdentity $arriving, ReceivedScreen $screen): self
    {
        if ($arriving->isSameStreamAs($this->identity)) {
            return new self($arriving, $screen, $this->retiredStreams);
        }

        $retired = [...$this->retiredStreams, $this->identity->streamName()];

        return new self($arriving, $screen, array_slice($retired, -self::RETIRED_STREAM_LIMIT));
    }

    /**
     * The slot's screen when it belongs to the registration the reader expects; a mismatch shows no pixels.
     */
    public function screenFor(ScreenRegistration $expected): ReceivedScreen|null
    {
        if (! $this->identity->registration->isSameAs($expected)) {
            return null;
        }

        return $this->screen;
    }
}
