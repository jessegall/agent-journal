<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards;

use App\Actors\Contracts\ProvidesPolicies;
use App\Actors\Values\PolicyRegistration;
use App\Bus\Contracts\ProvidesCommandMiddleware;
use App\Bus\Contracts\ProvidesCommands;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Modules\Cards\CommandMiddleware\RecordCards;
use Tests\Fixtures\Modules\Cards\Commands\DrawCard;
use Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck;
use Tests\Fixtures\Modules\Cards\Enums\DeckAbility;
use Tests\Fixtures\Modules\Cards\Models\Deck;
use Tests\Fixtures\Modules\Cards\Policies\DeckPolicy;

/**
 * A second test module standing in for another owner of commands: one exported, one private.
 */
final class CardsDomain extends Domain implements ProvidesCommandMiddleware, ProvidesCommands, ProvidesPolicies
{
    public function description(): string
    {
        return 'Cards drawn and shuffled: a second module outside the domain folder for the command bus tests.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->commands(DrawCard::class)
            ->build();
    }

    public function commands(): array
    {
        return [DrawCard::class, ShuffleDeck::class];
    }

    public function commandMiddleware(): array
    {
        return [MiddlewareDeclaration::around(RecordCards::class, CommandScope::all())];
    }

    public function policies(): array
    {
        return [new PolicyRegistration(Deck::class, DeckPolicy::class, DeckAbility::class)];
    }
}
