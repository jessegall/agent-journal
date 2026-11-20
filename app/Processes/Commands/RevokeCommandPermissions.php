<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\RevokeCommandPermissionsHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Values\CommandPattern;

/**
 * A user takes classes or exact commands away from a permission source, such as a role; the next admission is
 * narrowed by them.
 *
 * @extends Command<string>
 */
#[HandledBy(RevokeCommandPermissionsHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Administer)]
#[Operation('revoke_command_permissions', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class RevokeCommandPermissions extends Command implements AuthorizedCommand
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

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
