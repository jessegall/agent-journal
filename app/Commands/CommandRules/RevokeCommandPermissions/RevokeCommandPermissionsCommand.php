<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\RevokeCommandPermissions;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Enums\CommandRules\CommandClass;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;
use App\Values\CommandPattern;

/**
 * A user takes classes or exact commands away from a permission source, such as a role; the next admission is
 * narrowed by them.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class RevokeCommandPermissionsCommand extends Command
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
