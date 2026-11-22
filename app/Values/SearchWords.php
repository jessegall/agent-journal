<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ScoreTier;
use App\Exceptions\SearchWordsInvalid;
use Normalizer;

/**
 * The words of one search, trimmed and in NFC, with their case-folded form. Several words are one literal phrase:
 * spaces, punctuation and underscores inside it match as they are.
 */
final readonly class SearchWords
{
    public const int CHARACTER_MINIMUM = 2;

    public const int CHARACTER_LIMIT = 200;

    private function __construct(
        public string $text,
        public string $folded,
    ) {}

    /**
     * @throws SearchWordsInvalid
     */
    public static function fromInput(string $input): self
    {
        $text = Normalizer::normalize(trim($input), Normalizer::FORM_C);
        $text = $text === false ? trim($input) : $text;
        $length = mb_strlen($text);

        if ($length < self::CHARACTER_MINIMUM) {
            throw SearchWordsInvalid::tooShort(self::CHARACTER_MINIMUM);
        }

        if ($length > self::CHARACTER_LIMIT) {
            throw SearchWordsInvalid::tooLong(self::CHARACTER_LIMIT);
        }

        return new self($text, self::fold($text));
    }

    /**
     * A text in the same form the words are compared in: NFC and case folded.
     */
    public static function fold(string $text): string
    {
        $normal = Normalizer::normalize($text, Normalizer::FORM_C);

        return mb_convert_case($normal === false ? $text : $normal, MB_CASE_FOLD);
    }

    /**
     * The character column the words start at in a text that holds them, ignoring case; 0 when only the folded
     * forms match.
     */
    public function columnIn(string $text): int
    {
        $found = mb_stripos($text, $this->text);

        return $found === false ? 0 : $found;
    }

    public function isFoundIn(string $text): bool
    {
        return str_contains(self::fold($text), $this->folded);
    }

    /**
     * The highest title tier the title reaches, or null when the title does not hold the words at all.
     */
    public function titleTier(string $title): ScoreTier|null
    {
        $folded = self::fold(trim($title));

        if ($folded === $this->folded) {
            return ScoreTier::ExactTitle;
        }

        if (str_starts_with($folded, $this->folded)) {
            return ScoreTier::TitlePrefix;
        }

        if (str_contains($folded, $this->folded)) {
            return ScoreTier::TitleContains;
        }

        return null;
    }

    public function equals(self $other): bool
    {
        return $this->folded === $other->folded;
    }
}
