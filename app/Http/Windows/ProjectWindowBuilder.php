<?php

declare(strict_types=1);

namespace App\Http\Windows;

use App\Connections\Data\ProjectPaneData;
use App\Connections\Data\ProjectTreeEntryData;
use App\Connections\Enums\BindingReadiness;
use App\Hosts\Contracts\ProjectFiles;
use App\Hosts\Contracts\ServedEnvironment;
use App\Hosts\Protocol\Payloads\HostProjectEntryPayload;
use App\Models\Projects\ProjectBinding;
use App\Projects\Enums\ProjectWindowStatus;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

final readonly class ProjectWindowBuilder implements WindowBuilder
{
    public function __construct(
        private ProjectFiles $files,
        private ServedEnvironment $served,
        private SurfaceAttributeMap $policies,
    ) {}

    public function build(Request $visit): ProjectPaneData
    {
        $selection = ProjectBinding::findLastHeardFromIn($this->served->environmentIds());

        $pane = ProjectPaneData::build()
            ->fullUrl(route('connections.project', absolute: false))
            ->connectUrl(route('connections.connect', absolute: false));

        if ($selection->isEmpty()) {
            return $pane->status(ProjectWindowStatus::None)->items([])->finish();
        }

        $binding = $selection->get();

        if ($binding->readinessAt(CarbonImmutable::now()) !== BindingReadiness::Ready) {
            return $pane->status(ProjectWindowStatus::Offline)->items([])->finish();
        }

        $root = $this->files->folders($binding, [''])->of('');
        $policy = $this->policies->forType(ProjectPaneData::class);
        $items = array_map($this->entry(...), array_slice($root->entries, 0, $policy->limitFor('items')));

        return $pane->status(ProjectWindowStatus::fromRead($root->status))->items($items)->finish();
    }

    private function entry(HostProjectEntryPayload $entry): ProjectTreeEntryData
    {
        return ProjectTreeEntryData::from([
            'path' => $entry->name,
            'name' => $entry->name,
            'isFolder' => $entry->isFolder,
            'size' => $entry->size,
            'isOpen' => false,
            'isLoading' => false,
            'isFailed' => false,
            'children' => [],
        ]);
    }
}
