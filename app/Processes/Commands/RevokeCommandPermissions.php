<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Enums\CommandClass;
use App\Processes\Handlers\RevokeCommandPermissionsHandler;
use App\Processes\Values\CommandPattern;

/**
 * A user takes classes or exact commands away from a permission source, such as a role; the next admission is
 * narrowed by them.
 *
 * @implements Command<string>
 */
#[HandledBy(RevokeCommandPermissionsHandler::class)]
final readonly class RevokeCommandPermissions implements Command
{
    /**
     * @param  list<CommandClass>  $classes
     * @param  list<CommandPattern>  $patterns
     */
    public function __construct(
        public string $source,
        public array $classes,
        public array $patterns = [],
    ) {}
}
