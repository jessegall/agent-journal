<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ProposeReader;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\ProcessPolicy;
use App\Support\Command;
use App\Values\ReaderDefinition;

/**
 * An agent, or a user, proposes the reader for a request's declaration revision; it is stored as a draft that never
 * unlocks a run.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Create)]
final readonly class ProposeReaderCommand extends Command
{
    public function __construct(
        public string $commandRequestId,
        public int $declarationRevision,
        public ReaderDefinition $definition,
    ) {}
}
