<?php

declare(strict_types=1);

namespace App\Engine\Values;

/**
 * How far one pass over the ticking stacks has examined: the last stack, its version, its position and frame there, and
 * the frames already delivered. A stack whose version changed is examined again from its start, skipping delivered
 * frames, so no frame is lost or delivered twice.
 */
final readonly class ScanProgress
{
    /**
     * @param  list<string>  $delivered  the frame ids this pass delivered
     */
    private function __construct(
        public string $stackId,
        public int $stackVersion,
        public int $position,
        public string $anchorFrameId,
        public array $delivered,
    ) {}

    /**
     * Before the first stack, as a new pass starts.
     */
    public static function start(): self
    {
        return new self('', 0, -1, '', []);
    }

    /**
     * The progress after examining a frame, with the frames delivered since this pass began.
     *
     * @param  list<string>  $deliveredNow
     */
    public function after(
        string $stackId,
        int $stackVersion,
        int $position,
        string $frameId,
        array $deliveredNow,
    ): self {
        return new self($stackId, $stackVersion, $position, $frameId, [...$this->delivered, ...$deliveredNow]);
    }

    /**
     * The progress that has the next pass begin at a candidate this pass had no time left for, anchored on its frame.
     */
    public function resumeAt(TickCandidate $candidate): self
    {
        $delivered = array_values(array_diff($this->delivered, [$candidate->frameId]));

        return new self(
            $candidate->stackId,
            $candidate->stackVersion,
            $candidate->position - 1,
            $candidate->frameId,
            $delivered,
        );
    }

    /**
     * Whether the frame at this position of this stack, as the stack stands now, is still to be examined in this pass.
     */
    public function isAhead(string $stackId, int $stackVersion, int $position, string $frameId): bool
    {
        if ($stackId !== $this->stackId) {
            return $stackId > $this->stackId;
        }

        if ($stackVersion !== $this->stackVersion) {
            return ! in_array($frameId, $this->delivered, true);
        }

        return $position > $this->position;
    }
}
