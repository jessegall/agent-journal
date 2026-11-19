<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Proof;

use App\Bus\Support\Command;

/**
 * A command outside every Commands folder that proves how the base binds its dispatcher.
 *
 * @extends Command<void>
 */
final readonly class BoundItem extends Command
{
    public function __construct(
        public string $title,
        public int $quantity,
    ) {}
}
