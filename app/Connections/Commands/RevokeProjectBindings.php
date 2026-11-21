<?php

declare(strict_types=1);

namespace App\Connections\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Connections\Policies\ConnectionsPolicy;
use App\Connections\Values\RevokedBindings;
use App\Operations\Enums\AccessType;

/**
 * The owner revokes several connected folders at once, chosen in the Connect a project window, such as every
 * folder on a lost laptop: one write, so the request's key receipts it once.
 *
 * @extends Command<RevokedBindings>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Edit)]
final readonly class RevokeProjectBindings extends Command
{
    /**
     * @param  list<string>  $ids
     */
    public function __construct(public array $ids) {}
}
