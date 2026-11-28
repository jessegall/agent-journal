<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Connections\Data\ProjectTreeEntryData;
use App\Connections\Data\ProjectWindowData;
use App\Connections\Enums\BindingReadiness;
use App\Hosts\Contracts\ProjectFiles;
use App\Hosts\Contracts\ServedEnvironment;
use App\Hosts\Protocol\Payloads\HostProjectEntryPayload;
use App\Http\Requests\Connections\ProjectWindowRequest;
use App\Models\Projects\ProjectBinding;
use App\Projects\Enums\ProjectReadStatus;
use App\Projects\Enums\ProjectWindowStatus;
use App\Reads\PageFormRequests;
use App\Values\ProjectFileAnswers;
use App\Web\Creation\Contracts\PageBuilder;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

/**
 * The Project window: the tree of the connected folder heard from last, read through its host, the root and the
 * folders the user opened asked for together, once per view.
 */
final readonly class ProjectPageBuilder implements PageBuilder
{
    public function __construct(
        private ProjectFiles $files,
        private ServedEnvironment $served,
        private PageFormRequests $requests,
    ) {}

    public function build(Request $visit): ProjectWindowData
    {
        $input = $this->requests->from(ProjectWindowRequest::class, $visit);

        $found = ProjectBinding::findLastHeardFromIn($this->served->environmentIds());

        if (! $found->isDefined()) {
            return $this->window(ProjectWindowStatus::None, null, null);
        }

        $binding = $found->get();

        if ($binding->readinessAt(CarbonImmutable::now()) !== BindingReadiness::Ready) {
            return $this->window(ProjectWindowStatus::Offline, $binding->project_label, $binding->machine_label);
        }

        $open = $input->openFolders();

        $answers = $this->files->folders($binding, ['', ...$open]);

        $root = $answers->of('');

        $state = ProjectWindowStatus::fromRead($root->status);

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
        return ProjectWindowData::build()
            ->status($status)
            ->projectLabel($projectLabel)
            ->machineLabel($machineLabel)
            ->connectAddress(route('connections.connect', absolute: false))
            ->entries($entries)
            ->finish();
    }

    /**
     * A folder's entries as tree entries, each opened folder nested with its own answer.
     *
     * @param  list<HostProjectEntryPayload>  $entries
     * @param  list<string>  $open
     * @return list<ProjectTreeEntryData>
     */
    private function tree(ProjectFileAnswers $answers, string $folder, array $entries, array $open): array
    {
        $entryOf = function (HostProjectEntryPayload $entry) use ($answers, $folder, $open): ProjectTreeEntryData {
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
        };

        return array_map($entryOf, $entries);
    }
}
