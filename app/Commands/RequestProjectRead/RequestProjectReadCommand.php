<?php

declare(strict_types=1);

namespace App\Commands\RequestProjectRead;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Enums\ProjectReadType;
use App\Policies\ConnectionsPolicy;
use App\Support\Command;
use App\Values\ProjectFileAnswer;

/**
 * The owner asks a connected project's host for a folder's entries or a file's text; the same question asked again
 * while its read is recent gets that read, so a page that polls asks the host once.
 *
 * @extends Command<ProjectFileAnswer>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Read)]
final readonly class RequestProjectReadCommand extends Command
{
    public function __construct(
        public string $bindingId,
        public ProjectReadType $type,
        public string $path,
    ) {}
}
