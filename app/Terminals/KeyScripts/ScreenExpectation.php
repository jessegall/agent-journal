<?php

declare(strict_types=1);

namespace App\Terminals\KeyScripts;

use App\Hosts\Data\HostFrameData;
use App\Terminals\Screens\Enums\ScreenType;
use App\Terminals\Screens\ScreenReading;

/**
 * The screen a step needs before it acts: a still screen of a type and, for a menu, its family; or words that must
 * appear together on one row of whatever is drawn, a word naming a parameter in braces, such as "set model to {model}".
 */
final readonly class ScreenExpectation
{
    /**
     * @param  list<string>  $words
     */
    private function __construct(
        public ScreenType|null $type,
        public string|null $menu,
        public array $words,
        public string|null $fingerprint = null,
    ) {}

    public static function ready(): self
    {
        return new self(ScreenType::PromptReady, null, []);
    }

    public static function menu(string $family): self
    {
        return new self(ScreenType::Menu, $family, []);
    }

    /**
     * Whatever screen is drawn, once it holds still, as a navigation round acts on.
     */
    public static function still(): self
    {
        return new self(null, null, []);
    }

    /**
     * A still screen with the fingerprint a library entry recorded for it.
     */
    public static function fingerprinted(string $fingerprint): self
    {
        return new self(null, null, [], $fingerprint);
    }

    public static function shows(string ...$words): self
    {
        return new self(null, null, array_values($words));
    }

    /**
     * Whether the frame is the expected screen, with the run's values filled into its words.
     *
     * @param  array<string, string>  $values
     * @param  string|null  $fingerprint  the fingerprint of the frame, read only for an expectation that names one
     */
    public function isMetBy(ScreenReading $reading, HostFrameData $frame, array $values, string|null $fingerprint): bool
    {
        if ($this->fingerprint !== null) {
            return $reading->isStill && $fingerprint === $this->fingerprint;
        }

        if ($this->words !== []) {
            return array_any($frame->rows, fn (string $row) => $this->holdsEveryWord($row, $values));
        }

        if ($this->type === null) {
            return $reading->isStill;
        }

        return $reading->isStill && $reading->type === $this->type && $reading->menu?->name === $this->menu;
    }

    /**
     * @param  array<string, string>  $values
     */
    private function holdsEveryWord(string $row, array $values): bool
    {
        $text = mb_strtolower($row);

        $words = array_map(fn (string $word) => mb_strtolower(KeyStep::filled($word, $values)), $this->words);

        return array_all($words, fn (string $word) => str_contains($text, $word));
    }
}
