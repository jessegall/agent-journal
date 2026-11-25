<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands\OpenItem;

use Tests\Fixtures\Bus\Policies\FixturePolicy;
use App\Enums\Agents\AccessType;
use App\Attributes\Authorize;
use App\Support\Command;

/**
 * A command on the base that is readonly but not final, so the registry refuses it.
 *
 * @extends Command<mixed>
 */
readonly class OpenItemCommand extends Command
{
    public function __construct() {}
}
