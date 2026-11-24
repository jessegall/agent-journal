<?php

declare(strict_types=1);

namespace Tests\Fixtures\DriverState;

/**
 * Makes a driver's welcome screen go away by writing its own state, which only the account's first-run step may do.
 */
final readonly class OnboardingBypass
{
    /**
     * @return array<string, bool>
     */
    public function settings(): array
    {
        return ['hasCompletedOnboarding' => true];
    }
}
