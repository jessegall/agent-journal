<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Connections\Data\ProjectTreeEntryData;
use App\Connections\Data\ProjectWindowData;
use App\Connections\Enums\BindingReadiness;
use App\Hosts\Contracts\ProjectFiles;
use App\Hosts\Contracts\ServedEnvironment;
use App\Hosts\Protocol\Data\HostProjectEntryData;
use App\Http\Requests\Connections\ProjectWindowRequest;
use App\Models\Projects\ProjectBinding;
use App\Navigation\Contracts\PageResolver;
use App\Projects\Enums\ProjectReadStatus;
use App\Projects\Enums\ProjectWindowStatus;
use App\Values\ProjectFileAnswers;
use Carbon\CarbonImmutable;

/**
 * The Project window: the tree of the connected folder heard from last, read through its host, the root and the
 * folders the user opened asked for together, once per view.
 */
final readonly class ProjectWindowResolver implements PageResolver
{
    public function __construct(
        private ProjectFiles $files,
        private ServedEnvironment $served,
        private ProjectWindowRequest $request,
    ) {}

    public function read(): ProjectWindowData
    {
        $found = ProjectBinding::findLastHeardFromIn($this->served->environmentIds());

        if (! $found->isDefined()) {
            return $this->window(ProjectWindowStatus::None, null, null);
        }

        $binding = $found->get();

        if ($binding->readinessAt(CarbonImmutable::now()) !== BindingReadiness::Ready) {
            return $this->window(ProjectWindowStatus::Offline, $binding->project_label, $binding->machine_label);
        }

        $open = $this->request->openFolders();

        $answers = $this->files->folders($binding, ['', ...$open]);

        $root = $answers->of('');

        $state = match ($root->status) {
            ProjectReadStatus::Answered => ProjectWindowStatus::Ready,
            ProjectReadStatus::Pending => ProjectWindowStatus::Pending,
            ProjectReadStatus::Failed, ProjectReadStatus::Expired => ProjectWindowStatus::Failed,
        };

        $entries = $state === ProjectWindowStatus::Ready
            ? $this->tree($answers, '', $root->entries, $open)
            : [];

        return $this->window($state, $binding->project_label, $binding->machine_label, $entries);
    }

    /**
     * @param  list<ProjectTreeEntryData>  $entries
     */
    private function window(
        ProjectWindowStatus $status,
        string|null $projectLabel,
        string|null $machineLabel,
        array $entries = [],
    ): ProjectWindowData {
        return ProjectWindowData::from([
            'status' => $status,
            'projectLabel' => $projectLabel,
            'machineLabel' => $machineLabel,
            'connectAddress' => route('connections.connect', absolute: false),
            'entries' => $entries,
        ]);
    }

    /**
     * A folder's entries as tree entries, each opened folder nested with its own answer.
     *
     * @param  list<HostProjectEntryData>  $entries
     * @param  list<string>  $open
     * @return list<ProjectTreeEntryData>
     */
    private function tree(ProjectFileAnswers $answers, string $folder, array $entries, array $open): array
    {
        return array_map(function (HostProjectEntryData $entry) use ($answers, $folder, $open): ProjectTreeEntryData {
            $path = $folder === '' ? $entry->name : "{$folder}/{$entry->name}";
            $isOpen = $entry->isFolder && in_array($path, $open, true);
            $answer = $isOpen ? $answers->of($path) : null;

            return ProjectTreeEntryData::from([
                'path' => $path,
                'name' => $entry->name,
                'isFolder' => $entry->isFolder,
                'size' => $entry->size,
                'isOpen' => $isOpen,
                'isLoading' => $answer?->status === ProjectReadStatus::Pending,
                'isFailed' => in_array($answer?->status, [ProjectReadStatus::Failed, ProjectReadStatus::Expired], true),
                'children' => $answer?->status === ProjectReadStatus::Answered
                    ? $this->tree($answers, $path, $answer->entries, $open)
                    : [],
            ]);
        }, $entries);
    }
}
