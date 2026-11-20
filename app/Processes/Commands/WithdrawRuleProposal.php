<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Handlers\WithdrawRuleProposalHandler;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;

/**
 * The author of a proposal takes it back before review; it stays readable as history.
 *
 * @extends Command<string>
 */
#[HandledBy(WithdrawRuleProposalHandler::class)]
#[Authorize(ProcessAdministrationPolicy::class, ProcessAbility::Work)]
#[Operation('withdraw_rule_proposal', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class WithdrawRuleProposal extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $proposalId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return CommandRequest::class;
    }
}
