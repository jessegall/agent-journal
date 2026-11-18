<?php

declare(strict_types=1);

namespace App\Processes\Readers;

use App\Processes\Contracts\CommandRuleReader;
use App\Processes\Data\BundleRowData;
use App\Processes\Data\RequestListData;
use App\Processes\Data\RequestRowData;
use App\Processes\Data\RuleRowData;
use App\Processes\Models\ClassificationRule;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\ModuleRuleBundle;
use App\Processes\Support\CommandRuleRegistry;
use App\Processes\Support\ProjectKey;
use App\Processes\Values\RuleBundle;
use App\Ui\Contracts\PageReader;

/**
 * The review list of the current project only: its newest command requests, its rules and the module bundles whose
 * installed digest no owner has activated yet.
 */
final readonly class RequestListReader implements PageReader
{
    public function __construct(
        private ProjectKey $projects,
        private CommandRuleRegistry $rules,
        private CommandRuleReader $approved,
    ) {}

    public function read(): RequestListData
    {
        $project = $this->projects->current();
        $requests = CommandRequest::query()->ofProject($project)->readLimit(100)->get();
        $rules = ClassificationRule::query()->ofProject($project)->readLimit(200)->get();
        $activated = $this->approved->approvedBundles();
        $waiting = array_filter(
            $this->rules->bundles(),
            fn (RuleBundle $bundle): bool => ! array_any(
                $activated,
                fn (ModuleRuleBundle $row): bool => $row->approves($bundle),
            ),
        );

        return new RequestListData(
            array_values($requests->map(RequestRowData::fromRequest(...))->all()),
            array_values($rules->map(RuleRowData::fromRule(...))->all()),
            array_values(array_map(BundleRowData::fromBundle(...), $waiting)),
        );
    }
}
