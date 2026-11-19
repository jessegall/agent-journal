<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
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
final readonly class ShuffleDeck extends Command implements HasAuthorizationSubject
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
