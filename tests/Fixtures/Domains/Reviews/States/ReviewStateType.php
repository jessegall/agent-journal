<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\States;

use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\StateSet;
use App\Enums\SessionTransferType;
use App\Support\States\AgentState;
use App\Support\CurrentSettingsResolver;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;

/**
 * Builds the reviewing states of one batch from one read of the review group, through the settings reader of the
 * request running now; it keeps no reader or view between calls.
 */
final readonly class ReviewStateType implements StateLoader
{
    public const string TYPE_KEY = 'reviews.reviewing';

    public function __construct(private ReviewSettings $settings, private CurrentSettingsResolver $currentSettings) {}

    public function stateClass(): string
    {
        return ReviewState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $review = $this->currentSettings->resolver()->group($this->settings->review);

        return StateSet::build($references, fn (): AgentState => new ReviewState($review, $this->settings));
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::SessionOnly;
    }
}
