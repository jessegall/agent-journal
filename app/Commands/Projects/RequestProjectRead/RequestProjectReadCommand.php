<?php

declare(strict_types=1);

namespace App\Commands\Projects\RequestProjectRead;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Enums\Projects\ProjectReadType;
use App\Policies\ConnectionsPolicy;
use App\Support\Command;
use App\Values\ProjectFileAnswers;

/**
 * The owner asks a connected project's host for several folders' entries or files' text at once, as one view needs
 * them; a question asked again while its read is recent gets that read, so a page that polls asks the host once.
 *
 * @extends Command<ProjectFileAnswers>
 */
#[Authorize(ConnectionsPolicy::class, AccessType::Read)]
final readonly class RequestProjectReadCommand extends Command
{
    /**
     * The most paths one request asks for: a project's root and the folders one view opened.
     */
    public const int PATH_COUNT_LIMIT = 21;

    /**
     * @param  list<string>  $paths
     */
    public function __construct(
        public string $bindingId,
        public ProjectReadType $type,
        public array $paths,
    ) {}
}
