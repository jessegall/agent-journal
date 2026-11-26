<?php

declare(strict_types=1);

namespace App\Projects\Commands\RevokeProjectBindings;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ConnectionsPolicy;
use App\Projects\Values\RevokedBindings;
use App\Support\Command;

/**
 * The owner revokes several connected folders at once, chosen in the Connect a project window, such as every
 * folder on a lost laptop: one write, so the request's key receipts it once.
 *
 * @extends Command<RevokedBindings>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Edit)]
final readonly class RevokeProjectBindingsCommand extends Command
{
    /**
     * @param  list<string>  $ids
     */
    public function __construct(public array $ids) {}
}
