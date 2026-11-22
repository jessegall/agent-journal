<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use App\Values\RecordLocation;
use Domain\Tasks\Exceptions\TaskPassageUnavailable;

/**
 * A passage of a task's brief as search found it: the task revision it was read at and the character the match
 * starts at. Its id never changes for that revision, so an edited brief makes it unavailable instead of moving it.
 */
final readonly class TaskBriefPassage
{
    public const string FIELD = 'brief';

    private const string ID_PATTERN = '/^brief-r([1-9][0-9]{0,9})-c([0-9]{1,10})$/';

    private const int CONTEXT_CHARACTERS = 40;

    public function __construct(
        public int $revision,
        public int $characterOffset,
    ) {}

    /**
     * @throws TaskPassageUnavailable
     */
    public static function fromId(string $id): self
    {
        if (preg_match(self::ID_PATTERN, $id, $match) !== 1) {
            throw TaskPassageUnavailable::make();
        }

        return new self((int) $match[1], (int) $match[2]);
    }

    /**
     * Whether the text is a passage id as search issues them.
     */
    public static function isId(string $text): bool
    {
        return preg_match(self::ID_PATTERN, $text) === 1;
    }

    /**
     * Whether the passage is still there: the brief is at the revision it was found in and reaches its character.
     */
    public function isOpenIn(string $brief, int $currentRevision): bool
    {
        return $currentRevision === $this->revision && $this->characterOffset < mb_strlen($brief);
    }

    public function id(): string
    {
        return "brief-r{$this->revision}-c{$this->characterOffset}";
    }

    public function location(): RecordLocation
    {
        return new RecordLocation($this->id(), 'Brief');
    }

    /**
     * The line, from 1, and the character inside it a reader starts at to show the passage with a little of the
     * text before it, never before the line's start.
     *
     * @return array{0: int, 1: int}
     *
     * @throws TaskPassageUnavailable
     */
    public function startIn(string $brief, int $currentRevision): array
    {
        if (! $this->isOpenIn($brief, $currentRevision)) {
            throw TaskPassageUnavailable::make();
        }

        $before = mb_substr($brief, 0, $this->characterOffset);
        $line = substr_count($before, "\n") + 1;
        $lineStart = mb_strrpos($before, "\n");
        $column = $lineStart === false ? $this->characterOffset : $this->characterOffset - $lineStart - 1;

        return [$line, max(0, $column - self::CONTEXT_CHARACTERS)];
    }

    /**
     * The brief from the passage on, for a reader that shows it on its own.
     *
     * @throws TaskPassageUnavailable
     */
    public function excerptOf(string $brief, int $currentRevision, int $characters): string
    {
        $this->startIn($brief, $currentRevision);
        $start = max(0, $this->characterOffset - self::CONTEXT_CHARACTERS);

        return mb_substr($brief, $start, $characters);
    }
}
