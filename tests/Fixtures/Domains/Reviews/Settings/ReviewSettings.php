<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\Settings;

use App\Contracts\SettingsDefinition;
use App\Declarations\BooleanSetting;
use App\Declarations\ChoiceSetting;
use App\Declarations\DecimalSetting;
use App\Declarations\EnumSetting;
use App\Declarations\IntegerSetting;
use App\Declarations\SettingGroup;
use App\Declarations\StringSetting;
use App\Declarations\ToggleGroup;
use App\Values\Choice;
use App\Values\Decimal;
use Tests\Fixtures\Domains\Reviews\Enums\ReviewLevel;
use Tests\Fixtures\Domains\Reviews\Enums\ReviewMode;

/**
 * The fixture's settings: one of every type, in a group that can be switched off and a plain group.
 */
final class ReviewSettings implements SettingsDefinition
{
    public readonly IntegerSetting $retryLimit;

    public readonly BooleanSetting $notifyOwner;

    public readonly DecimalSetting $weight;

    /**
     * @var ChoiceSetting<string>
     */
    public readonly ChoiceSetting $summaryStyle;

    /**
     * @var EnumSetting<ReviewMode>
     */
    public readonly EnumSetting $reviewMode;

    /**
     * @var EnumSetting<ReviewLevel>
     */
    public readonly EnumSetting $reviewLevel;

    public readonly ToggleGroup $review;

    public readonly StringSetting $title;

    /**
     * @var ChoiceSetting<int>
     */
    public readonly ChoiceSetting $priority;

    public readonly SettingGroup $general;

    public function __construct()
    {
        $this->retryLimit = IntegerSetting::make('retry_limit', 'Retry limit', 3, minimum: 0, maximum: 10);
        $this->notifyOwner = BooleanSetting::make('notify_owner', 'Notify the owner', true);
        $this->weight = DecimalSetting::make('weight', 'Weight', Decimal::parse('0.50'), precision: 5, scale: 2);
        $this->summaryStyle = ChoiceSetting::make('summary_style', 'Summary style', 'short', [
            Choice::make('short', 'Short'),
            Choice::make('long', 'Long'),
        ]);
        $this->reviewMode = EnumSetting::make('review_mode', 'Review mode', ReviewMode::class, ReviewMode::Quick);
        $this->reviewLevel = EnumSetting::make(
'review_level',
 'Review level',
 ReviewLevel::class,
 ReviewLevel::FirstPass,
);
        $this->review = ToggleGroup::make(
'review',
 'Review',
 true,
 [$this->retryLimit, $this->notifyOwner, $this->weight, $this->summaryStyle, $this->reviewMode, $this->reviewLevel],
);
        $this->title = StringSetting::make('title', 'Title', 'Reviews', minimumLength: 1);
        $this->priority = ChoiceSetting::make('priority', 'Priority', 0, [
            Choice::make(0, 'Normal'),
            Choice::make(1, 'High'),
        ]);
        $this->general = SettingGroup::make('general', 'General', [$this->title, $this->priority]);
    }

    public function groups(): array
    {
        return [$this->general, $this->review];
    }
}
