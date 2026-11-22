<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\States;

use App\Contracts\Work\ConditionalState;
use App\Support\States\AgentState;
use App\Contracts\Settings\EnabledSettingsGroup;
use App\Support\DisabledSettingsGroup;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;

/**
 * The fixture's reviewing state: it runs only while the review group is on, as read when the state was built, and
 * reads the group's settings only then.
 */
final class ReviewState extends AgentState implements ConditionalState
{
    public function __construct(
private readonly EnabledSettingsGroup|DisabledSettingsGroup $review,
 private readonly ReviewSettings $settings,
) {}

    public function isEnabled(): bool
    {
        return $this->review instanceof EnabledSettingsGroup;
    }

    /**
     * How often a review is retried, read from the group as it was when the state was built.
     */
    public function retryLimit(): int
    {
        return $this->review instanceof EnabledSettingsGroup ? $this->review->integer($this->settings->retryLimit) : 0;
    }
}
