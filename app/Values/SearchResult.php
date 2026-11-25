<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Search\ScoreTier;
use App\Exceptions\SearchValueInvalid;
use App\Support\RecordIdentity;

/**
 * One match a source returns: a short plain title, the matching text around the words, the record it belongs to,
 * the tier it reached and, for a passage, where inside the record it lies.
 */
final readonly class SearchResult
{
    public const int TITLE_CHARACTER_LIMIT = 160;

    public const int SNIPPET_CHARACTER_LIMIT = 240;

    /**
     * @throws SearchValueInvalid
     */
    public function __construct(
        public string $title,
        public string $snippet,
        public RecordIdentity $reference,
        public ScoreTier $score,
        public RecordLocation|null $location = null,
    ) {
        if (trim($title) === '') {
            throw SearchValueInvalid::blank('title');
        }

        if (mb_strlen($title) > self::TITLE_CHARACTER_LIMIT) {
            throw SearchValueInvalid::tooLong('title', self::TITLE_CHARACTER_LIMIT);
        }

        if (mb_strlen($snippet) > self::SNIPPET_CHARACTER_LIMIT) {
            throw SearchValueInvalid::tooLong('snippet', self::SNIPPET_CHARACTER_LIMIT);
        }
    }

    /**
     * A result whose title and snippet are cut to their limits at whole Unicode characters, ending in … when cut.
     */
    public static function shortened(
        string $title,
        string $snippet,
        RecordIdentity $reference,
        ScoreTier $score,
        RecordLocation|null $location = null,
    ): self {
        return new self(
            self::cut($title, self::TITLE_CHARACTER_LIMIT),
            self::cut($snippet, self::SNIPPET_CHARACTER_LIMIT),
            $reference,
            $score,
            $location,
        );
    }

    /**
     * The identity this result has inside the source with the given qualified key.
     */
    public function identity(string $sourceKey): HitIdentity
    {
        return new HitIdentity($sourceKey, $this->reference->type, $this->reference->id, $this->location?->id);
    }

    /**
     * Below zero when this result comes first among one source's results: score descending, then identity.
     */
    public function compare(self $other): int
    {
        $order = $this->score->compare($other->score);

        if ($order !== 0) {
            return $order;
        }

        return $this->identity('')->compare($other->identity(''));
    }

    /**
     * The bytes this result's texts and identity take as a search carries them.
     */
    public function byteSize(): int
    {
        return strlen($this->title) + strlen($this->snippet) + strlen($this->reference->id)
            + strlen((string) $this->location?->id) + strlen((string) $this->location?->label);
    }

    private static function cut(string $text, int $limit): string
    {
        $plain = (string) preg_replace('/[\p{C}\s]+/u', ' ', trim($text));

        if (mb_strlen($plain) <= $limit) {
            return $plain;
        }

        return mb_substr($plain, 0, $limit - 1).'…';
    }
}
