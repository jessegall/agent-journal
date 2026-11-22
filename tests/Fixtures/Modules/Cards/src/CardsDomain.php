<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards;

use App\Enums\AccessType;
use App\Contracts\Authorization\PolicyProvider;
use App\Values\PolicyDefinition;
use App\Contracts\Bus\CommandMiddlewareProvider;
use App\Contracts\Bus\CommandProvider;
use App\Support\CommandScope;
use App\Support\MiddlewareDeclaration;
use App\Support\Domain;
use App\Support\Exports;
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
