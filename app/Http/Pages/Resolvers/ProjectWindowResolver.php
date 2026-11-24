<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Contracts\Hosts\ProjectFiles;
use App\Contracts\Hosts\ServedEnvironment;
use App\Contracts\Navigation\PageResolver;
use App\Data\Connections\ProjectTreeEntryData;
use App\Data\Connections\ProjectWindowData;
use App\Enums\BindingReadiness;
use App\Enums\ProjectReadState;
use App\Enums\ProjectWindowState;
use App\Http\Requests\Connections\ProjectWindowRequest;
use App\Models\Projects\ProjectBinding;
use App\Values\ProjectEntry;
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
        $found = ProjectBinding::lastHeardFromIn($this->served->environmentIds());

        if (! $found->isDefined()) {
            return $this->window(ProjectWindowState::None, null, null);
        }

        $binding = $found->get();

        if ($binding->readinessAt(CarbonImmutable::now()) !== BindingReadiness::Ready) {
            return $this->window(ProjectWindowState::Offline, $binding->project_label, $binding->machine_label);
        }

        $open = $this->request->openFolders();
        $answers = $this->files->folders($binding, ['', ...$open]);
        $root = $answers->of('');

        $state = match ($root->state) {
            ProjectReadState::Answered => ProjectWindowState::Ready,
            ProjectReadState::Pending => ProjectWindowState::Pending,
            ProjectReadState::Failed, ProjectReadState::Expired => ProjectWindowState::Failed,
        };

        $entries = $state === ProjectWindowState::Ready
            ? $this->tree($answers, '', $root->entries, $open)
            : [];

        return $this->window($state, $binding->project_label, $binding->machine_label, $entries);
    }

    /**
     * @param  list<ProjectTreeEntryData>  $entries
     */
    private function window(
        ProjectWindowState $state,
        string|null $projectLabel,
        string|null $machineLabel,
        array $entries = [],
    ): ProjectWindowData {
        return ProjectWindowData::from([
            'state' => $state,
            'projectLabel' => $projectLabel,
            'machineLabel' => $machineLabel,
            'connectAddress' => route('connections.connect', absolute: false),
            'entries' => $entries,
        ]);
    }

    /**
     * A folder's entries as tree entries, each opened folder nested with its own answer.
     *
     * @param  list<ProjectEntry>  $entries
     * @param  list<string>  $open
     * @return list<ProjectTreeEntryData>
     */
    private function tree(ProjectFileAnswers $answers, string $folder, array $entries, array $open): array
    {
        return array_map(function (ProjectEntry $entry) use ($answers, $folder, $open): ProjectTreeEntryData {
            $path = $folder === '' ? $entry->name : "{$folder}/{$entry->name}";
            $isOpen = $entry->isFolder && in_array($path, $open, true);
            $answer = $isOpen ? $answers->of($path) : null;

            return ProjectTreeEntryData::from([
                'path' => $path,
                'name' => $entry->name,
                'isFolder' => $entry->isFolder,
                'size' => $entry->size,
                'isOpen' => $isOpen,
                'isLoading' => $answer?->state === ProjectReadState::Pending,
                'isFailed' => in_array($answer?->state, [ProjectReadState::Failed, ProjectReadState::Expired], true),
                'children' => $answer?->state === ProjectReadState::Answered
                    ? $this->tree($answers, $path, $answer->entries, $open)
                    : [],
            ]);
        }, $entries);
    }
}
