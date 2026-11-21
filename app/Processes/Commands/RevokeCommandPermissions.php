<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Enums\CommandClass;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\CommandPattern;

/**
 * A user takes classes or exact commands away from a permission source, such as a role; the next admission is
 * narrowed by them.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class RevokeCommandPermissions extends Command
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
