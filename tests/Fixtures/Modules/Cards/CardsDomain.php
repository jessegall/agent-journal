<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards;

use App\Core\Bus\Contracts\ProvidesCommandMiddleware;
use App\Core\Bus\Contracts\ProvidesCommands;
use App\Core\Bus\Support\CommandScope;
use App\Core\Bus\Support\MiddlewareDeclaration;
use App\Domain\Contracts\Domain;
use Tests\Fixtures\Modules\Cards\CommandMiddleware\RecordCards;
use Tests\Fixtures\Modules\Cards\Commands\DrawCard;
use Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck;

/**
 * A second test module standing in for another owner of commands: one exported, one private.
 */
final class CardsDomain implements Domain, ProvidesCommandMiddleware, ProvidesCommands
{
    public function description(): string
    {
        return 'Cards drawn and shuffled: a second module outside app/Domain for the command bus tests.';
    }

    public function requires(): array
    {
        return [];
    }

    /**
     * @return list<class-string>
     */
    public function exports(): array
    {
        return [DrawCard::class];
    }

    public function commands(): array
    {
        return [DrawCard::class, ShuffleDeck::class];
    }

    public function commandMiddleware(): array
    {
        return [MiddlewareDeclaration::around(RecordCards::class, CommandScope::all())];
    }
}
