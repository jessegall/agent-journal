<?php

declare(strict_types=1);

namespace App\CommandRules\Enums;

use App\CommandRules\Values\NextStep;
use App\Mcp\Tools\CommandRequestProveTool;
use App\Mcp\Tools\CommandRequestSampleTool;
use App\Mcp\Tools\CommandRequestShowTool;
use App\Mcp\Tools\CommandTypeProposeTool;

/**
 * Where a command request stands. Each state names what is still owed and the one
 * command that moves it on; no state is left by a timeout, a skip, an unreadable mark or a waiver.
 */
enum RequestStatus: string
{
    case CollectingDeclaration = 'collecting_declaration';
    case AwaitingSampleApproval = 'awaiting_sample_approval';
    case ReadyForSample = 'ready_for_sample';
    case CapturingSample = 'capturing_sample';
    case AwaitingProof = 'awaiting_proof';
    case AwaitingApproval = 'awaiting_approval';
    case Active = 'active';
    case Rejected = 'rejected';
    case Withdrawn = 'withdrawn';

    /**
     * Whether the request still holds work: every state but the approved and the two closed ones.
     */
    public function isOpen(): bool
    {
        return ! in_array($this, [self::Active, self::Rejected, self::Withdrawn], true);
    }

    /**
     * Whether the request has ended and only counts as history.
     */
    public function isClosed(): bool
    {
        return match ($this) {
            self::Rejected, self::Withdrawn => true,
            self::CollectingDeclaration, self::AwaitingSampleApproval, self::ReadyForSample, self::CapturingSample,
            self::AwaitingProof, self::AwaitingApproval, self::Active => false,
        };
    }

    /**
     * Whether a new declaration sends a request in this state back to collecting, so its sample and proof start again.
     */
    public function restartsCollection(): bool
    {
        return $this !== self::CollectingDeclaration && $this->allows(self::CollectingDeclaration);
    }

    /**
     * Whether a request in this state may move to the other state.
     */
    public function allows(self $next): bool
    {
        if ($next->isClosed()) {
            return $this->isOpen();
        }

        return in_array($next, match ($this) {
            self::CollectingDeclaration => [self::AwaitingSampleApproval],
            self::AwaitingSampleApproval => [
                self::ReadyForSample,
                self::CollectingDeclaration,
                self::Active,
            ],
            self::ReadyForSample => [self::CapturingSample],
            self::CapturingSample => [
                self::AwaitingProof,
                self::AwaitingSampleApproval,
            ],
            self::AwaitingProof => [
                self::AwaitingApproval,
                self::CollectingDeclaration,
                self::ReadyForSample,
            ],
            self::AwaitingApproval => [
                self::Active,
                self::CollectingDeclaration,
            ],
            self::Active, self::Rejected, self::Withdrawn => [],
        }, true);
    }

    /**
     * What is still owed in this state and the exact command that moves the request on.
     */
    public function nextStep(string $requestId, string $operation): NextStep
    {
        return new NextStep($this, $this->steps(), $this->nextCommand($requestId, $operation));
    }

    /**
     * @return list<string>
     */
    private function steps(): array
    {
        return match ($this) {
            self::CollectingDeclaration => ['a proposed classification and a bounded reader'],
            self::AwaitingSampleApproval => ["a project owner's approval of one evidence sample"],
            self::ReadyForSample => ['one captured evidence sample'],
            self::CapturingSample => ['the evidence sample run to end'],
            self::AwaitingProof => ["the journal's proof of the reader against real runs"],
            self::AwaitingApproval => ["a project owner's approval of the declaration, reader and proof"],
            self::Active, self::Rejected, self::Withdrawn => [],
        };
    }

    private function nextCommand(string $requestId, string $operation): string
    {
        return match ($this) {
            self::CollectingDeclaration => sprintf(
                "the %s tool with request %s and a declaration file for '%s'",
                CommandTypeProposeTool::NAME,
                $requestId,
                $operation,
            ),
            self::AwaitingSampleApproval => "waiting for the owner to approve request {$requestId}'s sample",
            self::ReadyForSample => sprintf(
                'the %s tool with request %s and the permit its approval gave',
                CommandRequestSampleTool::NAME,
                $requestId,
            ),
            self::CapturingSample => sprintf(
                'waiting for the sample run; the %s tool with request %s shows when it ends',
                CommandRequestShowTool::NAME,
                $requestId,
            ),
            self::AwaitingProof => sprintf(
                'the %s tool with request %s, its reader revision and its sample runs',
                CommandRequestProveTool::NAME,
                $requestId,
            ),
            self::AwaitingApproval => "waiting for the owner to approve request {$requestId}'s declaration and proof",
            self::Active => 'none: the command is approved and runs',
            self::Rejected, self::Withdrawn => 'none: the request is closed; a new attempt opens a new request',
        };
    }
}
