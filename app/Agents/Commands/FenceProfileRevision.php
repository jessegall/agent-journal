<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\FenceProfileRevisionHandler;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Retains the intent to fence every session launched from a revoked configuration revision, named by an opaque
 * reference, in the transaction that revokes it, so a lost event cannot lose the revocation.
 *
 * @implements Command<string>
 */
#[HandledBy(FenceProfileRevisionHandler::class)]
final readonly class FenceProfileRevision implements Command
{
    public function __construct(public string $revisionReference) {}
}
