<?php

declare(strict_types=1);

namespace Domain\Documents\Values;

use App\Values\RecordLocation;

/**
 * A passage of a published text as search found it: for a document the revision it was read in, and the line it
 * starts on. Its id never changes for that revision, so a newer revision makes it unavailable instead of moving it.
 */
final readonly class PublicationPassage
{
    private const string ID_PATTERN = '/^(?:r([1-9][0-9]{0,9})-)?l([1-9][0-9]{0,9})$/';

    private const int EXCERPT_LINES = 40;

    public function __construct(
        public int|null $revision,
        public int $line,
    ) {}

    public static function isId(string $text): bool
    {
        return preg_match(self::ID_PATTERN, $text) === 1;
    }

    /**
     * The passage an id names; ask isId() first.
     */
    public static function fromId(string $id): self
    {
        preg_match(self::ID_PATTERN, $id, $match);

        return new self($match[1] === '' ? null : (int) $match[1], (int) $match[2]);
    }

    public function id(): string
    {
        return $this->revision === null ? "l{$this->line}" : "r{$this->revision}-l{$this->line}";
    }

    public function location(): RecordLocation
    {
        $label = $this->revision === null ? "Line {$this->line}" : "Revision {$this->revision}, line {$this->line}";

        return new RecordLocation($this->id(), $label);
    }

    /**
     * The text from the passage's line on, a few lines of it, for checking the words are still there; empty when
     * the text no longer reaches that line.
     */
    public function excerptOf(string $text): string
    {
        $lines = explode("\n", $text);

        return implode("\n", array_slice($lines, $this->line - 1, self::EXCERPT_LINES));
    }

    /**
     * The read arguments that open the text at this passage, beside the record's id argument.
     *
     * @return array<string, string|int>
     */
    public function readArguments(): array
    {
        $arguments = ['view' => 'body', 'line_start' => $this->line];

        if ($this->revision !== null) {
            $arguments['revision'] = $this->revision;
        }

        return $arguments;
    }
}
