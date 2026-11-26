<?php

declare(strict_types=1);

namespace App\Terminals;

use App\Terminals\Data\ScreenFrameData;

/**
 * Whose screen a frame is: the runtime's registration, and the host process, stream and privacy revision of the
 * report that brought it.
 */
final readonly class ScreenIdentity
{
    public function __construct(
        public ScreenRegistration $registration,
        public string $epoch,
        public string|null $stream,
        public int $privacyRevision,
    ) {}

    /**
     * The identity of a frame arriving for the registration; an older host names no stream.
     */
    public static function ofReport(ScreenRegistration $registration, ScreenFrameData $frame): self
    {
        return new self($registration, $frame->epoch, $frame->stream, $frame->privacyRevision);
    }

    /**
     * The stream as one name across host processes, for the list of retired streams; an older host's frames of one
     * process are all one stream.
     */
    public function streamName(): string
    {
        return "{$this->epoch}/{$this->stream}";
    }

    public function isSameStreamAs(self $other): bool
    {
        return $this->streamName() === $other->streamName();
    }

    public function isSameHostProcessAs(self $other): bool
    {
        return $this->epoch === $other->epoch;
    }
}
