<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\PartsItem;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Contracts\Part;

/**
 * A command carrying a list typed on a contract, whatever class is behind each part.
 *
 * @extends Command<int>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class PartsItemCommand extends Command
{
    /**
     * @param  list<Part>  $parts
     */
    public function __construct(public array $parts) {}
}
