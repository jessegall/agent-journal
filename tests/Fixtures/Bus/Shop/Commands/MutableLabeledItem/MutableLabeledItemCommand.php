<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\MutableLabeledItem;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Values\MutableLabel;

/**
 * A command carrying a MutableLabel.
 *
 * @extends Command<int>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class MutableLabeledItemCommand extends Command
{
    public function __construct(public MutableLabel $label) {}
}
