<?php

declare(strict_types=1);

namespace App\Processes\Resolvers;

use App\Processes\Data\BundleListPartData;
use App\Processes\Data\BundleRowData;
use App\Processes\Data\ClassificationRuleRowData;
use App\Processes\Data\RequestRowData;
use App\Processes\Models\ClassificationRule;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\ModuleRuleBundle;
use App\Processes\Support\CommandRuleRegistry;
use App\Processes\Support\ProjectKey;
use App\Processes\Support\ProjectRules;
use App\Processes\Values\RuleBundle;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutNativeData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;

/**
 * The project owner's review list as a list layout: the command requests and where each stands, each opening its own
 * request; the project's rules; and the module rule bundles waiting for activation at their exact digest, a native
 * part so each activation carries its own idempotency key. Each list says so when it is empty.
 */
final readonly class RequestListResolver implements PageResolver
{
    public function __construct(
        private ProjectKey $projects,
        private CommandRuleRegistry $rules,
        private ProjectRules $approved,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $project = $this->projects->current();
        $requests = CommandRequest::query()->ofProject($project)->limit(100)->get();
        $rules = ClassificationRule::query()->ofProject($project)->readLimit(200)->get();
        $activated = $this->approved->approvedBundles();

        $waiting = array_filter(
            $this->rules->bundles(),
            fn (RuleBundle $bundle): bool => ! array_any(
                $activated,
                fn (ModuleRuleBundle $row): bool => $row->approves($bundle),
            ),
        );

        $requestRows = array_values($requests->map(RequestRowData::fromRequest(...))->all());
        $ruleRows = array_values($rules->map(ClassificationRuleRowData::fromRule(...))->all());

        $bundles = BundleListPartData::from([
            'bundles' => array_values(array_map(BundleRowData::fromBundle(...), $waiting)),
        ]);

        return DeclaredLayoutData::of(LayoutPartData::box(
            'review',
            'stack',
            LayoutPartData::box('header', 'header', LayoutPartData::text('title', 'Command review', 'heading')),
            LayoutPartData::text('kinds', 'Sorting a command into kinds does not allow it to run.', 'muted'),
            $this->requestsOf($requestRows),
            $this->rulesOf($ruleRows),
            LayoutPartData::native('bundles', LayoutNativeData::of('processes/BundleApprovals', $bundles)),
        ));
    }

    /**
     * @param  list<RequestRowData>  $requests
     */
    private function requestsOf(array $requests): LayoutPartData
    {
        $heading = LayoutPartData::text('heading', 'Requests', 'heading');

        if ($requests === []) {
            return LayoutPartData::box(
                'requests',
                'section',
                $heading,
                LayoutPartData::notice('empty', 'empty', 'No command request is waiting.'),
            );
        }

        return LayoutPartData::box('requests', 'section', $heading, LayoutPartData::collection(
            'rows',
            'list',
            array_map(fn (RequestRowData $request) => new LayoutRowData(
                $request->id,
                $request->operation,
                $request->state,
                detail: "{$request->line} · {$request->holdReason} · next: {$request->next}",
                href: "/processes/requests/{$request->id}",
            ), $requests),
        ));
    }

    /**
     * @param  list<ClassificationRuleRowData>  $rules
     */
    private function rulesOf(array $rules): LayoutPartData
    {
        $heading = LayoutPartData::text('heading', 'Rules', 'heading');

        if ($rules === []) {
            return LayoutPartData::box(
                'rules',
                'section',
                $heading,
                LayoutPartData::notice('empty', 'empty', 'The project has no rule of its own yet.'),
            );
        }

        return LayoutPartData::box('rules', 'section', $heading, LayoutPartData::collection(
            'rows',
            'list',
            array_map(fn (ClassificationRuleRowData $rule) => new LayoutRowData(
                $rule->id,
                "{$rule->ruleId} ({$rule->owner}) revision {$rule->revision}",
                $rule->state,
                detail: $rule->reason,
            ), $rules),
        ));
    }
}
