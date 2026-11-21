<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Commands;

use Tests\Fixtures\Bus\Policies\FixturePolicy;
use App\Operations\Enums\AccessType;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;

/**
 * A command on the base that is readonly but not final, so the registry refuses it.
 *
 * @extends Command<mixed>
 */
readonly class OpenItem extends Command
{
    public function __construct() {}
}
