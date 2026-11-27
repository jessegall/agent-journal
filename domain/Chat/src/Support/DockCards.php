<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use Domain\Chat\Support\Cards\ComposedCard;
use Domain\Chat\Support\Cards\DockCard;
use Domain\Chat\Support\Cards\DockIdentity;
use PhpOption\Option;

/**
 * The cards the owners composed for one page of the dock, by the source each one shows.
 */
final class DockCards
{
    /**
     * @var array<string, DockCard>
     */
    private array $cards = [];

    public function add(ComposedCard $composed): void
    {
        $this->cards[self::keyOf($composed->source)] = $composed->card;
    }

    /**
     * @return Option<DockCard>
     */
    public function find(DockIdentity $identity): Option
    {
        return Option::fromArraysValue($this->cards, self::keyOf($identity));
    }

    private static function keyOf(DockIdentity $identity): string
    {
        return "{$identity->type}:{$identity->id}";
    }
}
