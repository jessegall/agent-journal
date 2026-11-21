<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Commands;

use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use Tests\Fixtures\Modules\Cards\Models\Deck;
use Tests\Fixtures\Modules\Cards\Policies\DeckPolicy;

/**
 * @extends Command<string>
 */
#[Authorize(DeckPolicy::class, AccessType::Edit)]
final readonly class DrawCard extends Command
{
    public function __construct(public string $deck) {}
}
