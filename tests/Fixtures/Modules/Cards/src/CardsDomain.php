<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards;

use App\Operations\Enums\AccessType;
use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyDefinition;
use App\Bus\Contracts\CommandMiddlewareProvider;
use App\Bus\Contracts\CommandProvider;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Tests\Fixtures\Modules\Cards\CommandMiddleware\RecordCards;
use Tests\Fixtures\Modules\Cards\Commands\DrawCard\DrawCardCommand;
use Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck\ShuffleDeckCommand;
use Tests\Fixtures\Modules\Cards\Models\Deck;
use Tests\Fixtures\Modules\Cards\Policies\DeckPolicy;

/**
 * A second test module standing in for another owner of commands: one exported, one private.
 */
final class CardsDomain extends Domain implements CommandMiddlewareProvider, CommandProvider, PolicyProvider
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
            ->commands(DrawCardCommand::class)
            ->build();
    }

    public function commands(): array
    {
        return [DrawCardCommand::class, ShuffleDeckCommand::class];
    }

    public function commandMiddleware(): array
    {
        return [MiddlewareDeclaration::around(RecordCards::class, CommandScope::all())];
    }

    public function policies(): array
    {
        return [new PolicyDefinition(DeckPolicy::class, [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Delete])];
    }
}
