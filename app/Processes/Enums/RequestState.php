<?php

declare(strict_types=1);

namespace App\Processes\Enums;

use App\Processes\Values\NextStep;

/**
 * Where a command request stands (doc 21 revision 6, section 71). Each state names what is still owed and the one
 * command that moves it on; no state is left by a timeout, a skip, an unreadable mark or a waiver.
 */
enum RequestState: string
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
        return $this === self::Rejected || $this === self::Withdrawn;
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
        if ($next === self::Rejected || $next === self::Withdrawn) {
            return $this->isOpen();
        }

        return in_array($next, match ($this) {
            self::CollectingDeclaration => [self::AwaitingSampleApproval],
            self::AwaitingSampleApproval => [self::ReadyForSample, self::CollectingDeclaration],
            self::ReadyForSample => [self::CapturingSample],
            self::CapturingSample => [self::AwaitingProof, self::ReadyForSample],
            self::AwaitingProof => [self::AwaitingApproval, self::CollectingDeclaration],
            self::AwaitingApproval => [self::Active, self::CollectingDeclaration],
            self::Active, self::Rejected, self::Withdrawn => [],
        }, true);
    }

    /**
     * What is still owed in this state and the exact command that moves the request on.
     */
    public function nextStep(string $requestId, string $operation): NextStep
    {
        return new NextStep($this, $this->obligations(), $this->nextCommand($requestId, $operation));
    }

    /**
     * @return list<string>
     */
    private function obligations(): array
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
            self::CollectingDeclaration => "journal command-type propose --request {$requestId}"
                ." --operation '{$operation}'",
            self::AwaitingSampleApproval => "waiting for the owner: journal reader sample-approve {$requestId}",
            self::ReadyForSample => "journal reader sample-run {$requestId}",
            self::CapturingSample => "waiting for the sample run: journal command-request show {$requestId}",
            self::AwaitingProof => "journal reader prove {$requestId}",
            self::AwaitingApproval => "waiting for the owner: journal command-type approve {$requestId}",
            self::Active => 'none: the command is approved and runs',
            self::Rejected, self::Withdrawn => 'none: the request is closed; a new attempt opens a new request',
        };
    }
}
