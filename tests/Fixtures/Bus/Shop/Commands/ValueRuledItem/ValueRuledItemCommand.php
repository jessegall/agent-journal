<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\ValueRuledItem;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Values\RuledLabel;

/**
 * A command carrying a value whose property has a validation attribute.
 *
 * @extends Command<mixed>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class ValueRuledItemCommand extends Command
{
    public function __construct(public RuledLabel $label) {}
}
