<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\SaveCommandAlias;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProcessAdministrationPolicy;
use App\Support\Command;

/**
 * A user saves a command line under an alias of the project the key names: a new alias starts at
 * revision 1, a changed line is its next revision. The alias's revision is the answer.
 *
 * @extends Command<int>
 */
#[Authorize(ProcessAdministrationPolicy::class, AccessType::Edit)]
final readonly class SaveCommandAliasCommand extends Command
{
    /**
     * @param  list<string>  $arguments  the names of the positional arguments the line takes
     */
    public function __construct(
        public string $projectKey,
        public string $name,
        public string $line,
        public array $arguments,
    ) {}
}
