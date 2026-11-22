<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\HoldReason;
use App\Enums\StatusActionType;

/**
 * What the bar says of a hold on the agent's driver: its words, the decision it waits on and where that decision is
 * made, the running driver's terminal when the agent has one, else the host operator. A hold only a fresh report
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

        $inDriver = static fn (string $decision, string $withoutTerminal) => $hasTerminal
            ? "{$decision} Answer it in the running driver."
            : $withoutTerminal;

        return match ($hold) {
            HoldReason::OnboardingRequired => new self(
                'Finish setup',
                $hasTerminal
                    ? 'The driver asks for its first-run setup, such as a theme or its terms.'
                    : 'Ask the host operator to finish setup in the running driver.',
                $open,
            ),
            HoldReason::LoginRequired => new self(
                'Waiting for sign-in',
                'Sign in to its account in the running driver or on the host, never in chat.',
                $hasTerminal ? $open : [StatusAction::of(StatusActionType::SignIn)],
            ),
            HoldReason::TrustRequired => new self(
                'Waiting for trust',
                $inDriver(
                    'The driver asks whether to trust this folder.',
                    'Ask the host operator to answer the trust prompt.',
                ),
                $open,
            ),
            HoldReason::PermissionRequired => new self(
                'Waiting for permission',
                $inDriver(
                    'The driver asks for permission.',
                    'Ask the host operator to answer the permission prompt.',
                ),
                $open,
            ),
            HoldReason::UserInput, HoldReason::DriverInput => new self(
                'Waiting for input',
                $inDriver('The driver waits for input.', 'Ask the host operator to answer the driver.'),
                $open,
            ),
            HoldReason::UpdateRequired => new self(
                'Update required',
                'Ask the host operator to update the driver.',
                [],
            ),
            HoldReason::UnknownScreen => new self('The driver needs attention', null, $open),
            HoldReason::ScreenUnreadable => new self("The journal can't read the driver screen.", null, $open),
            HoldReason::NavigationNeeded => new self(
                'Waiting for the main desk',
                'The main desk is choosing the next step in the driver.',
                [],
            ),
            HoldReason::Compacting => new self('Compacting', null, []),
            HoldReason::UsageLimited => new self(
                'Usage limit reached',
                'The driver waits until its account may be used again.',
                [],
            ),
            HoldReason::NeedsAttention => new self('Needs attention', null, $open),
            HoldReason::Interrupted => new self('Interrupted', null, []),
            HoldReason::None => new self('Working', null, []),
        };
    }
}
