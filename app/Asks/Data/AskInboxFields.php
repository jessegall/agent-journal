<?php

declare(strict_types=1);

namespace App\Asks\Data;

use App\Web\Creation\Exceptions\MissingFields;

final class AskInboxFields
{
    /** @var list<AskCard> */
    private array $cards;

    private bool $hasBefore = false;

    private string|null $before;

    /** @param list<AskCard> $cards */
    public function cards(array $cards): self
    {
        $this->cards = $cards;

        return $this;
    }

    public function before(string|null $before): self
    {
        $this->before = $before;
        $this->hasBefore = true;

        return $this;
    }

    public function finish(): AskInbox
    {
        if (! isset($this->cards)) {
            throw MissingFields::forType(AskInbox::class, 'cards');
        }

        if (! $this->hasBefore) {
            throw MissingFields::forType(AskInbox::class, 'before');
        }

        return new AskInbox(
            cards: $this->cards,
            before: $this->before,
        );
    }
}
