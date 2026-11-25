<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Contracts\Settings\Setting;
use App\Contracts\Settings\SettingCommands;
use App\Contracts\Settings\SettingsResolver;
use App\Declarations\BooleanSetting;
use App\Declarations\DecimalSetting;
use App\Declarations\IntegerSetting;
use App\Declarations\StringSetting;
use App\Models\Records\SettingsRecord;
use App\Values\Decimal;
use Illuminate\Database\DatabaseManager;
use PHPUnit\Framework\Assert;

/**
 * The settings of a test, changed through the settings commands as the actor in place and read as the application
 * reads them, and a stored record of broken text for the tests of what reading it does.
 */
trait ArrangesSettings
{
    /**
     * Changes the owner's setting to the value through its command, against the owner's stored revision.
     */
    public function setting(string $owner, Setting $setting, string|bool|int|Decimal $value): self
    {
        $commands = $this->app->make(SettingCommands::class);
        $revision = SettingsRecord::findSharedRuntimeForOwner($owner)->map(
            fn (SettingsRecord $record) => $record->revision,
        )->getOrElse(0);

        $this->run(match (true) {
            $setting instanceof StringSetting && is_string($value) => $commands->string($setting, $value, $revision),
            $setting instanceof BooleanSetting && is_bool($value) => $commands->boolean($setting, $value, $revision),
            $setting instanceof IntegerSetting && is_int($value) => $commands->integer($setting, $value, $revision),
            $setting instanceof DecimalSetting && $value instanceof Decimal => $commands->decimal(
                $setting,
                $value,
                $revision,
            ),
            default => throw FixtureRefused::settingValue($setting->key()),
        });

        return $this;
    }

    /**
     * The setting's value as the application reads it now.
     */
    public function settingOf(Setting $setting): string|bool|int|Decimal
    {
        $this->app->forgetScopedInstances();
        $settings = $this->app->make(SettingsResolver::class);

        return match (true) {
            $setting instanceof StringSetting => $settings->string($setting),
            $setting instanceof BooleanSetting => $settings->boolean($setting),
            $setting instanceof IntegerSetting => $settings->integer($setting),
            $setting instanceof DecimalSetting => $settings->decimal($setting),
            default => throw FixtureRefused::settingValue($setting->key()),
        };
    }

    public function assertSetting(Setting $setting, string|bool|int|Decimal $expected): self
    {
        Assert::assertEquals(
            $expected,
            $this->settingOf($setting),
            "The setting {$setting->key()} holds another value.",
        );

        return $this;
    }

    /**
     * Stores this text as the owner's settings document as it is, valid or not, for a test of how a read takes it.
     */
    public function malformedStoredSetting(string $owner, string $storedText): self
    {
        SettingsRecord::create($owner);
        $this->app->make(DatabaseManager::class)
            ->table('settings_records')
            ->where('owner', $owner)
            ->update(['document' => $storedText]);

        return $this;
    }
}
