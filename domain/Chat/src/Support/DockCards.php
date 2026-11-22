<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Support\Cards\ComposedCard;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockIdentity;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

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
        $key = self::keyOf($identity);

        return isset($this->cards[$key]) ? Some::create($this->cards[$key]) : None::create();
    }

    private static function keyOf(DockIdentity $identity): string
    {
        return "{$identity->type}:{$identity->id}";
    }
}
