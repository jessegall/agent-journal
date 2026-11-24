<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\NavigationProofRefused;

/**
 * The text the main agent says proves its navigation, matched as the host matches it: case and white space are
 * folded and nothing else, so every digit, dot and dash counts, and the text stands as a whole word group.
 */
final readonly class NavigationProof
{
    private const int MOST_CHARACTERS = 200;

    /**
     * The characters that join the parts of a name, such as GPT-6-Sol or Opus 5.5.
     */
    private const string JOINERS = '-._';

    private function __construct(public string $text) {}

    /**
     * A proof of the text that the screen at raise time did not already show.
     *
     * @param  list<string>  $raiseRows
     *
     * @throws NavigationProofRefused
     */
    public static function against(string $text, array $raiseRows): self
    {
        if (trim($text) === '' || mb_strlen($text) > self::MOST_CHARACTERS) {
            throw NavigationProofRefused::empty(self::MOST_CHARACTERS);
        }

        $proof = new self($text);

        if ($proof->isSeenIn($raiseRows)) {
            throw NavigationProofRefused::alreadyOnScreen($text);
        }

        return $proof;
    }

    /**
     * Whether one of the rows holds the proof as a whole word group.
     *
     * @param  list<string>  $rows
     */
    public function isSeenIn(array $rows): bool
    {
        $wanted = self::folded($this->text);

        foreach ($rows as $row) {
            if ($this->containsWholeWord(self::folded($row), $wanted)) {
                return true;
            }
        }

        return false;
    }

    private function containsWholeWord(string $row, string $wanted): bool
    {
        $offset = 0;

        while (($at = mb_strpos($row, $wanted, $offset)) !== false) {
            $before = self::backwards($row, $at);
            $after = mb_substr($row, $at + mb_strlen($wanted), 2);

            if (! self::continuesWord($before) && ! self::continuesWord($after)) {
                return true;
            }

            $offset = $at + 1;
        }

        return false;
    }

    /**
     * The two characters before the position, nearest first, so wordGoesOn reads them away from the word.
     */
    private static function backwards(string $row, int $position): string
    {
        $nearest = $position >= 1 ? mb_substr($row, $position - 1, 1) : '';
        $next = $position >= 2 ? mb_substr($row, $position - 2, 1) : '';

        return $nearest.$next;
    }

    /**
     * Whether the text next to a word, read away from it, continues the word: a letter or digit, or a joiner followed
     * by one.
     */
    private static function continuesWord(string $next): bool
    {
        $first = mb_substr($next, 0, 1);
        $second = mb_substr($next, 1, 1);

        if (preg_match('/^[\p{L}\p{N}]$/u', $first) === 1) {
            return true;
        }

        return $first !== '' && str_contains(self::JOINERS, $first) && preg_match('/^[\p{L}\p{N}]$/u', $second) === 1;
    }

    private static function folded(string $text): string
    {
        return trim((string) preg_replace('/[\s\x{00A0}]+/u', ' ', mb_strtolower($text)));
    }
}
