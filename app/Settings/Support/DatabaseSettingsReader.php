<?php

declare(strict_types=1);

namespace App\Settings\Support;

use App\Settings\Contracts\EnabledSettingsGroup;
use App\Settings\Contracts\Setting;
use App\Settings\Contracts\SettingsDefinition;
use App\Settings\Contracts\SettingsReader;
use App\Settings\Contracts\SettingsSnapshot;
use App\Settings\Declarations\BooleanSetting;
use App\Settings\Declarations\ChoiceSetting;
use App\Settings\Declarations\DecimalSetting;
use App\Settings\Declarations\EnumSetting;
use App\Settings\Declarations\IntegerSetting;
use App\Settings\Declarations\StringSetting;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\Exceptions\SettingsUnavailable;
use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\SettingsDocument;
use App\Settings\Values\Decimal;
use BackedEnum;
use Illuminate\Database\LostConnectionException;
use Illuminate\Database\QueryException;

/**
 * Reads settings from each owner's shared record, one record read per owner for the request or job it is scoped to;
 * a write in the same request tells it to forget that owner. It never asks who is acting.
 */
final class DatabaseSettingsReader implements SettingsReader
{
    /**
     * @var array<string, StoredSettings> by owner
     */
    private array $owners = [];

    public function __construct(private readonly SettingRegistry $registry, private readonly SettingCodec $codec) {}

    public function string(StringSetting $setting): string
    {
        return $this->plain($setting)->string($setting);
    }

    public function boolean(BooleanSetting $setting): bool
    {
        return $this->plain($setting)->boolean($setting);
    }

    public function integer(IntegerSetting $setting): int
    {
        return $this->plain($setting)->integer($setting);
    }

    public function decimal(DecimalSetting $setting): Decimal
    {
        return $this->plain($setting)->decimal($setting);
    }

    /**
     * @template TValue of string|int
     *
     * @param  ChoiceSetting<TValue>  $setting
     * @return TValue
     */
    public function choice(ChoiceSetting $setting): string|int
    {
        return $this->plain($setting)->choice($setting);
    }

    public function enum(EnumSetting $setting): BackedEnum
    {
        return $this->plain($setting)->enum($setting);
    }

    public function group(ToggleGroup $group): EnabledSettingsGroup|DisabledSettingsGroup
    {
        return $this->stored($this->registry->ownerOf($group)->owner)->group($group);
    }

    public function snapshot(SettingsDefinition $definition): SettingsSnapshot
    {
        return new StoredSettingsSnapshot($this->stored($this->registry->ownerOfDefinition($definition)));
    }

    /**
     * Drops what was read of the owner, so the next read sees a write made since.
     */
    public function forget(string $owner): void
    {
        unset($this->owners[$owner]);
    }

    private function plain(Setting $setting): StoredSettings
    {
        $stored = $this->stored($this->registry->ownerOf($setting)->owner);
        $stored->requirePlain($setting);

        return $stored;
    }

    /**
     * @throws SettingsUnavailable
     */
    private function stored(string $owner): StoredSettings
    {
        return $this->owners[$owner] ??= $this->read($owner);
    }

    /**
     * @throws SettingsUnavailable
     */
    private function read(string $owner): StoredSettings
    {
        try {
            $record = SettingsRecord::sharedRuntimeForOwner($owner);
        } catch (QueryException|LostConnectionException $failure) {
            throw SettingsUnavailable::for($owner, $failure);
        }

        return $record
            ->map(fn (SettingsRecord $found) => new StoredSettings($owner, $found->revision, $found->document, $this->codec, $this->registry))
            ->getOrCall(fn () => new StoredSettings($owner, 0, SettingsDocument::empty(), $this->codec, $this->registry));
    }
}
