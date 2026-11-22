<?php

declare(strict_types=1);

namespace App\Commands\RevokeProjectBindings;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\ConnectionsPolicy;
use App\Support\Command;
use App\Values\RevokedBindings;

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
