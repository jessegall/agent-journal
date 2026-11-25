<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\States;

use App\Attributes\StateType;
use App\Contracts\Settings\EnabledSettingsGroup;
use App\Contracts\Work\ConditionalState;
use App\Enums\Sessions\SessionTransferType;
use App\Support\CurrentSettingsResolver;
use App\Support\DisabledSettingsGroup;
use App\Support\States\AgentState;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;

/**
 * A review state that runs only while the review settings group is switched on, read from the settings each time.
 */
#[StateType(self::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::SessionOnly)]
final class ReviewState extends AgentState implements ConditionalState
{
    public const string TYPE_KEY = 'reviews.reviewing';

    public function __construct(
        private readonly ReviewSettings $settings,
        private readonly CurrentSettingsResolver $currentSettings,
    ) {}

    public function isEnabled(): bool
    {
        return $this->group() instanceof EnabledSettingsGroup;
    }

    /**
     * How often a review is retried, read from the group as it is now.
     */
    public function retryLimit(): int
    {
        $review = $this->group();

        return $review instanceof EnabledSettingsGroup ? $review->integer($this->settings->retryLimit) : 0;
    }

    private function group(): EnabledSettingsGroup|DisabledSettingsGroup
    {
        return $this->currentSettings->resolver()->group($this->settings->review);
    }
}
