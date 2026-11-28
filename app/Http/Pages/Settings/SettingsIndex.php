<?php

declare(strict_types=1);

namespace App\Http\Pages\Settings;

use App\Actors\Contracts\CurrentActor;
use App\Connections\ConnectedProjects;
use App\Connections\ConnectionCursors;
use App\Connections\ConnectionsOwnerCheck;
use App\Connections\Exceptions\ServerOriginInvalid;
use App\Settings\Contracts\SettingsCatalogue;
use App\Settings\CoreSettings;
use App\Settings\Data\SettingData;
use App\Settings\Data\SettingGroupData;
use App\Settings\Data\SettingsCatalogueData;
use App\Settings\Data\StringChoiceConstraintsData;
use App\Settings\Data\StringChoiceOptionData;
use App\Settings\Data\StringChoiceValueData;
use App\Settings\Data\ToggleGroupAvailabilityData;
use App\Settings\Enums\ActionMethod;
use App\Settings\Enums\GroupAvailability;
use App\Settings\Enums\SettingSource;
use App\Settings\Enums\SettingType;
use App\Settings\SettingRegistry;
use App\Settings\SettingsValues;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\SettingsGroup;
use App\Support\Layout\SettingsRow;

/**
 * The settings of every owner: one section per declared group, General and Connected projects first, then each
 * domain's, each with its switch beside its heading. Settings save as they change, and Reset takes a group's changed
 * ones back to their defaults, refused when the group changed meanwhile.
 */
final readonly class SettingsIndex extends SettingsPage
{
    private const array ORDER = [
        'general',
        'connected_projects',
        'tasks',
        'plans',
        'documents',
        'sequences',
        'memory',
        'reminders',
        'helpers',
    ];

    private const string DOMAIN_SWITCH = 'domain_';

    public function __construct(
        private SettingsCatalogue $catalogue,
        private CurrentActor $actors,
        private ConnectionsOwnerCheck $connections,
        private CoreSettings $core,
        private ConnectedProjects $projects,
    ) {}

    public function layout(ConnectionCursors $cursors): DeclaredLayoutData
    {
        $sections = [];

        foreach ($this->catalogue->everyOwner() as $owner) {
            foreach ($owner->groups as $group) {
                $sections[] = [
                    $this->rank($owner, $group),
                    $this->sectionOf($owner, $group, $cursors),
                ];
            }
        }

        usort($sections, fn (array $first, array $second) => $first[0] <=> $second[0]);

        return SettingsGroup::page(...array_map(fn (array $ranked) => $ranked[1], $sections));
    }

    /**
     * Where a group reads in the order: a Core group by its own key, a domain's switch by its domain's name and any
     * other group by its owner, so a domain's own settings follow its switch.
     */
    private function rank(SettingsCatalogueData $owner, SettingGroupData $group): int
    {
        $key = $group->identity->key;

        $subject = match (true) {
            $owner->owner !== SettingRegistry::CORE => strtolower($owner->owner),
            str_starts_with($key, self::DOMAIN_SWITCH) => substr($key, strlen(self::DOMAIN_SWITCH)),
            default => $key,
        };

        $position = array_search($subject, self::ORDER, true);

        return 2 * ($position === false ? count(self::ORDER) : $position) + ($this->isSwitched($group) ? 0 : 1);
    }

    private function sectionOf(SettingsCatalogueData $owner, SettingGroupData $group, ConnectionCursors $cursors): SettingsGroup
    {
        $fixed = [
            'owner' => $owner->owner,
            'group' => $group->identity->key,
            'revision' => $owner->revision,
        ];

        $isConnections = $owner->owner === SettingRegistry::CORE
            && $group->identity->key === $this->core->connectedProjects->key;

        $rows = $isConnections ? $this->withoutSwitch($group->settings) : $group->settings;

        $section = SettingsGroup::build()
            ->key($group->identity->key)
            ->title($group->label)
            ->help($group->description)
            ->finish()
            ->withRows(...$this->rowsOf($rows, $isConnections, $cursors));

        $section = match (true) {
            $isConnections => $section->switchedBy(
                $this->saving($fixed),
                LayoutFieldData::build()
                    ->name($this->core->remoteProjects->key)
                    ->value($this->switchTextOf($group->settings))
                    ->finish(),
            ),
            $this->isSwitched($group) => $section->switchedBy(
                LayoutFormData::build()
                    ->method(ActionMethod::Post)
                    ->href(route('settings.switch', [], false))
                    ->fixed($fixed)
                    ->finish(),
                LayoutFieldData::build()->name('enabled')->value($this->isOn($group) ? '1' : '0')->finish(),
            ),
            default => $section,
        };

        $section = array_any($rows, SettingsValues::isEditable(...))
            ? $section->savingTo($this->saving($fixed))
            : $section;

        if (array_any($rows, fn (SettingData $setting) => $setting->source === SettingSource::Override)) {
            return $section->resettableBy(LayoutFormData::build()
                ->method(ActionMethod::Post)
                ->href(route('settings.reset', [], false))
                ->fixed($fixed)
                ->confirmed("{$group->label} settings reset")
                ->finish());
        }

        return $section;
    }

    /**
     * The Connected projects settings without the remote projects setting, which is drawn as the section's switch.
     *
     * @param  list<SettingData>  $settings
     * @return list<SettingData>
     */
    private function withoutSwitch(array $settings): array
    {
        $remoteProjects = $this->core->remoteProjects->key;

        return array_values(array_filter(
            $settings,
            fn (SettingData $setting) => $setting->identity->key !== $remoteProjects,
        ));
    }

    /**
     * A row for each setting, and for Connected projects the connect line and the connected projects after them.
     *
     * @param  list<SettingData>  $settings
     * @return list<SettingsRow>
     */
    private function rowsOf(array $settings, bool $isConnections, ConnectionCursors $cursors): array
    {
        $rows = array_map(fn (SettingData $setting) => $this->rowOf($setting), $settings);

        if (! $isConnections) {
            return $rows;
        }

        return [
            ...$rows,
            ...$this->connectionRows($cursors),
        ];
    }

    /**
     * @param  array<string, string|int>  $fixed
     */
    private function saving(array $fixed): LayoutFormData
    {
        return LayoutFormData::build()
            ->method(ActionMethod::Post)
            ->href(route('settings.save', [], false))
            ->fixed($fixed)
            ->finish();
    }

    /**
     * The connect line and the connected projects, for the owner, drawn in the section as the connection window shows
     * them; a journal whose own address is not set right says so in the row, and the rest of Settings still shows.
     *
     * @return list<SettingsRow>
     */
    private function connectionRows(ConnectionCursors $cursors): array
    {
        if (! $this->connections->allows($this->actors->actor())) {
            return [];
        }

        try {
            $connections = $this->projects->read($cursors);
        } catch (ServerOriginInvalid $invalid) {
            return [SettingsRow::build()
                ->key('projects')
                ->label('Connect a project')
                ->value($invalid->getMessage())
                ->finish()->inBlock()];
        }

        $panel = LayoutPartData::build()
            ->asNative()
            ->key('projects')
            ->native(
                LayoutNativeData::build()
                    ->component('connections/ConnectedProjectsPart')
                    ->props($connections)
                    ->finish(),
            )
            ->finish();

        return [SettingsRow::build()
            ->key('projects')
            ->label('Connect a project')
            ->control($panel)
            ->isBlock(true)
            ->finish()];
    }

    /**
     * @param  list<SettingData>  $settings
     */
    private function switchTextOf(array $settings): string
    {
        foreach ($settings as $setting) {
            if ($setting->identity->key === $this->core->remoteProjects->key) {
                return SettingsValues::textOf($setting) ?? '0';
            }
        }

        return '0';
    }

    private function isSwitched(SettingGroupData $group): bool
    {
        return $group->availability instanceof ToggleGroupAvailabilityData;
    }

    private function isOn(SettingGroupData $group): bool
    {
        return $group->availability instanceof ToggleGroupAvailabilityData
            && $group->availability->state === GroupAvailability::Enabled;
    }

    private function rowOf(SettingData $setting): SettingsRow
    {
        $key = $setting->identity->key;
        $text = SettingsValues::textOf($setting);

        if ($text === null || ! SettingsValues::isEditable($setting)) {
            return SettingsRow::build()
                ->key($key)
                ->label($setting->label)
                ->value($text ?? 'Not shown')
                ->help($setting->description)
                ->finish()->inBlock();
        }

        $row = match (true) {
            $setting->default instanceof StringChoiceValueData => SettingsRow::build()
                ->key($key)
                ->label($setting->label)
                ->help($setting->description)
                ->field(
                    LayoutFieldData::build()
                        ->name($key)
                        ->value($text)
                        ->clears([])
                        ->options($this->optionsOf($setting))
                        ->finish(),
                    'choice',
                )
                ->finish(),
            $setting->type === SettingType::Boolean => SettingsRow::build()
                ->key($key)
                ->label($setting->label)
                ->help($setting->description)
                ->field(LayoutFieldData::build()->name($key)->value($text)->finish(), 'toggle')
                ->finish(),
            default => SettingsRow::build()
                ->key($key)
                ->label($setting->label)
                ->help($setting->description)
                ->field(LayoutFieldData::build()->name($key)->value($text)->finish(), 'text')
                ->finish(),
        };

        if ($setting->source === SettingSource::Override) {
            return $row->changed();
        }

        return $row;
    }

    /**
     * @return list<string>
     */
    private function optionsOf(SettingData $setting): array
    {
        $constraints = $setting->constraints;

        if ($constraints instanceof StringChoiceConstraintsData) {
            return array_map(fn (StringChoiceOptionData $option) => $option->optionKey, $constraints->options);
        }

        return [];
    }
}
