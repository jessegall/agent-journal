<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\RestoreCommandRuleHandler;
use App\Processes\Values\ProposalReceipt;

/**
 * A project owner restores an earlier approved revision of a rule: it becomes a new proposal that still needs
 * approval.
 *
 * @implements Command<ProposalReceipt>
 */
#[HandledBy(RestoreCommandRuleHandler::class)]
final readonly class RestoreCommandRule implements Command
{
    public function __construct(
        public string $classificationRuleId,
        public int $fromRevision,
        public int $expectedRevision,
        public string $requestId,
    ) {}
}
