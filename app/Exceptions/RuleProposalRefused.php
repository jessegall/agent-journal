<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\ProposalState;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A rule proposal cannot take this change: its request id is bound to another payload, it is ended, another actor
 * asked, the expected revision is stale, or the declaration would escape the rules a known check must follow.
 */
final class RuleProposalRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function requestReused(string $requestId): self
    {
        return new self("The request id {$requestId} already proposed another declaration; use a new request id.");
    }

    public static function ended(string $id, ProposalState $state): self
    {
        return new self("Proposal {$id} is {$state->value}, so it takes no new revision.");
    }

    public static function notPending(string $id, ProposalState $state): self
    {
        return new self("Proposal {$id} is {$state->value}; only a complete pending proposal is reviewed.");
    }

    public static function notTheAuthor(string $id): self
    {
        return new self("Only the author of proposal {$id} may revise or withdraw it.");
    }

    public static function notTheRequester(string $requestId): self
    {
        return new self("Only the actor who opened request {$requestId}, or a user, may propose for it.");
    }

    public static function stale(string $id, int $expected, int $current): self
    {
        return new self(
            "Proposal {$id} is at revision {$current}, not {$expected}; read it again and revise that one.",
        );
    }

    public static function outsideProject(string $ruleId): self
    {
        return new self(
            "The rule {$ruleId} is not a project rule; a module's rule is changed by a project rule that replaces it.",
        );
    }

    public static function checkRenamed(string $operation): self
    {
        return new self(
            "{$operation} is known as a test, check or build, so it is declared with its contract and proven reader.",
        );
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
