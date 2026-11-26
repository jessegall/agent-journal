<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Cards\Commands\DrawCard;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Tests\Fixtures\Modules\Cards\Policies\DeckPolicy;

/**
 * @extends Command<string>
 */
#[Authorize(DeckPolicy::class, AccessType::Edit)]
final readonly class DrawCardCommand extends Command
{
    public function __construct(public string $deck) {}
}
