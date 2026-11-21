<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\HoldReason;
use App\Agents\Enums\StatusActionType;

/**
 * What the bar says of a hold on the agent's program: its words, the decision it waits on and where that decision is
 * made, the running program's terminal when the agent has one, else the host operator. A hold only a fresh report
 * clears offers no release here.
 */
final readonly class HoldCopy
{
    /**
     * @param  list<StatusAction>  $actions
     */
    private function __construct(
        public string $label,
        public string|null $reason,
        public array $actions,
    ) {}

    public static function of(HoldReason $hold, bool $hasTerminal): self
    {
        $open = $hasTerminal ? [StatusAction::of(StatusActionType::OpenTerminal)] : [];
        $inProgram = static fn (string $decision, string $withoutTerminal) => $hasTerminal
            ? "{$decision} Answer it in the running program."
            : $withoutTerminal;

        return match ($hold) {
            HoldReason::OnboardingRequired => new self(
                'Finish setup',
                $hasTerminal
                    ? 'The program asks for its first-run setup, such as a theme or its terms.'
                    : 'Ask the host operator to finish setup in the running program.',
                $open,
            ),
            HoldReason::LoginRequired => new self(
                'Waiting for sign-in',
                'Sign in to its account in the running program or on the host, never in chat.',
                $hasTerminal ? $open : [StatusAction::of(StatusActionType::SignIn)],
            ),
            HoldReason::TrustRequired => new self(
                'Waiting for trust',
                $inProgram(
                    'The program asks whether to trust this folder.',
                    'Ask the host operator to answer the trust prompt.',
                ),
                $open,
            ),
            HoldReason::PermissionRequired => new self(
                'Waiting for permission',
                $inProgram(
                    'The program asks for permission.',
                    'Ask the host operator to answer the permission prompt.',
                ),
                $open,
            ),
            HoldReason::UserInput, HoldReason::DriverInput => new self(
                'Waiting for input',
                $inProgram('The program waits for input.', 'Ask the host operator to answer the program.'),
                $open,
            ),
            HoldReason::UpdateRequired => new self(
                'Update required',
                'Ask the host operator to update the program.',
                [],
            ),
            HoldReason::UnknownScreen => new self('The program needs attention', null, $open),
            HoldReason::ScreenUnreadable => new self("The journal can't read the program screen.", null, $open),
            HoldReason::NavigationNeeded => new self(
                'Waiting for the main desk',
                'The main desk is choosing the next step in the program.',
                [],
            ),
            HoldReason::Compacting => new self('Compacting', null, []),
            HoldReason::UsageLimited => new self(
                'Usage limit reached',
                'The program waits until its account may be used again.',
                [],
            ),
            HoldReason::NeedsAttention => new self('Needs attention', null, $open),
            HoldReason::Interrupted => new self('Interrupted', null, []),
            HoldReason::None => new self('Working', null, []),
        };
    }
}
