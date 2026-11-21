<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessPolicy;
use App\Processes\Values\ReaderDefinition;

/**
 * An agent, or a user, proposes the reader for a request's declaration revision; it is stored as a draft that never
 * unlocks a run.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Create)]
final readonly class ProposeReader extends Command
{
    public function __construct(
        public string $commandRequestId,
        public int $declarationRevision,
        public ReaderDefinition $definition,
    ) {}
}
