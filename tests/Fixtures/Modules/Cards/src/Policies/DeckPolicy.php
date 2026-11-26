<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Policies;

use App\Access\Contracts\Policy;
use Tests\Fixtures\Modules\Cards\Models\Deck;

/**
 * Who may run the decks commands: every granted actor, so the grants decide.
 */
final readonly class DeckPolicy implements Policy
{
    public static function model(): string
    {
        return Deck::class;
    }
}
