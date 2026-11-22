<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Commands\DrawCard;

use App\Enums\AccessType;
use App\Attributes\Authorize;
use App\Support\Command;
use Tests\Fixtures\Modules\Cards\Models\Deck;
use Tests\Fixtures\Modules\Cards\Policies\DeckPolicy;

/**
 * @extends Command<string>
 */
#[Authorize(DeckPolicy::class, AccessType::Edit)]
final readonly class DrawCardCommand extends Command
{
    public function __construct(public string $deck) {}
}
