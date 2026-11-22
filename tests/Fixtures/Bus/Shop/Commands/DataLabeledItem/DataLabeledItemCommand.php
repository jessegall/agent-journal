<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\DataLabeledItem;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Tests\Fixtures\Bus\Policies\FixturePolicy;
use Tests\Fixtures\Bus\Shop\Values\DataLabel;

/**
 * A command carrying a DataLabel.
 *
 * @extends Command<int>
 */
#[Authorize(FixturePolicy::class, AccessType::Edit)]
final readonly class DataLabeledItemCommand extends Command
{
    public function __construct(public DataLabel $label) {}
}
