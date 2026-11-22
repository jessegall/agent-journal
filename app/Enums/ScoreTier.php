<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * How well a hit matches the words: a visible reference beats an exact title, which beats a title prefix, a title that
 * contains the words, and a permitted body that contains them. A hit takes the highest tier it reaches.
 */
enum ScoreTier: int
{
    case Reference = 500;
    case ExactTitle = 400;
    case TitlePrefix = 300;
    case TitleContains = 200;
    case BodyContains = 100;

    /**
     * The title tiers from the highest down, the order a provider visits them in.
     *
     * @return list<self>
     */
    public static function titleTiers(): array
    {
        return [self::ExactTitle, self::TitlePrefix, self::TitleContains];
    }

    /**
     * The title tier a provider visits after this one, or null when this is the last tier it visits.
     */
    public function nextTitleTier(): self|null
    {
        $tiers = self::titleTiers();
        $index = array_search($this, $tiers, true);

        if ($index === false) {
            return null;
        }

        return $tiers[$index + 1] ?? null;
    }

    public function isAbove(self $other): bool
    {
        return $this->value > $other->value;
    }

    /**
     * Below zero when this tier comes first in the order of hits: the higher score leads.
     */
    public function compare(self $other): int
    {
        return $other->value <=> $this->value;
    }
}
