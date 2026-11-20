<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Cards\Enums\DeckAbility;
use Tests\Fixtures\Modules\Cards\Handlers\ShuffleDeckHandler;
use Tests\Fixtures\Modules\Cards\Models\Deck;
use Tests\Fixtures\Modules\Cards\Policies\DeckPolicy;

/**
 * @extends Command<string>
 */
#[HandledBy(ShuffleDeckHandler::class)]
#[Authorize(DeckPolicy::class, DeckAbility::Work)]
#[Operation('shuffle_deck', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ShuffleDeck extends Command implements AuthorizedCommand
{
    public function __construct(public string $deck) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Deck::class;
    }
}
