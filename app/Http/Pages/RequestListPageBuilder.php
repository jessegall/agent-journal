<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\CommandRules\CommandRuleRegistry;
use App\CommandRules\ProjectRules;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\ModuleRuleBundle;
use App\Processes\Data\BundleListPartData;
use App\Processes\Data\BundleRowData;
use App\Processes\Data\ClassificationRuleRowData;
use App\Processes\Data\RequestRowData;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Values\RuleBundle;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * The project owner's review list as a list layout: the command requests and where each stands, each opening its own
 * request; the project's rules; and the module rule bundles waiting for activation at their exact digest, a native
 * part so each activation carries its own idempotency key. Each list says so when it is empty.
 */
final readonly class RequestListPageBuilder implements PageBuilder
{
    public function __construct(
        private CommandRuleRegistry $rules,
        private ProjectRules $approved,
    ) {}

    public function build(Request $visit): RequestListPageData
    {
        return RequestListPageData::build()->shown($this->content())->finish();
    }

    private function content(): DeclaredLayoutData
    {
        $requests = CommandRequest::query()->limit(100)->get();
        $rules = ClassificationRule::query()->limit(200)->get();
        $activated = $this->approved->approvedBundles();

        $waiting = array_filter(
            $this->rules->bundles(),
            fn (RuleBundle $bundle) => ! array_any(
                $activated,
                fn (ModuleRuleBundle $row) => $row->approves($bundle),
            ),
        );

        $requestRows = array_values($requests->map(RequestRowData::fromRequest(...))->all());
        $ruleRows = array_values($rules->map(ClassificationRuleRowData::fromRule(...))->all());

        $bundles = BundleListPartData::from([
            'bundles' => array_values(array_map(BundleRowData::fromBundle(...), $waiting)),
        ]);

        return DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asBox()
                ->key('review')
                ->style('stack')
                ->children(
                    LayoutPartData::build()
                    ->asBox()
                    ->key('header')
                    ->style('header')
                    ->children(
                        LayoutPartData::build()
                        ->asText()
                        ->key('title')
                        ->value('Command review')
                        ->style('heading')
                        ->finish(),
                    )
                    ->finish(),
                    LayoutPartData::build()
                    ->asText()
                    ->key('kinds')
                    ->value('Sorting a command into kinds does not allow it to run.')
                    ->style('muted')
                    ->finish(),
                    $this->requestsOf($requestRows),
                    $this->rulesOf($ruleRows),
                    LayoutPartData::build()
                    ->asNative()
                    ->key('bundles')
                    ->native(
                        LayoutNativeData::build()->component('processes/BundleApprovals')->props($bundles)->finish(),
                    )
                    ->finish(),
                )
                ->finish(),
            )
            ->finish();
    }

    /**
     * @param  list<RequestRowData>  $requests
     */
    private function requestsOf(array $requests): LayoutPartData
    {
        $heading = LayoutPartData::build()
            ->asText()
            ->key('heading')
            ->value('Requests')
            ->style('heading')
            ->finish();

        if ($requests === []) {
            return LayoutPartData::build()
                ->asBox()
                ->key('requests')
                ->style('section')
                ->children(
                    $heading,
                    LayoutPartData::build()
                    ->asNotice()
                    ->key('empty')
                    ->style('empty')
                    ->title('No command request is waiting.')
                    ->finish(),
                )
                ->finish();
        }

        return LayoutPartData::build()
            ->asBox()
            ->key('requests')
            ->style('section')
            ->children(
                $heading,
                LayoutPartData::build()
                ->asCollection()
                ->key('rows')
                ->style('list')
                ->rows(
                    array_map(
                        fn (RequestRowData $request) => LayoutRowData::build()
                            ->key($request->id)
                            ->label($request->operation)
                            ->value($request->state)
                            ->detail("{$request->line} · {$request->holdReason} · next: {$request->next}")
                            ->href("/processes/requests/{$request->id}")
                            ->finish(),
                        $requests,
                    ),
                )
                ->finish(),
            )
            ->finish();
    }

    /**
     * @param  list<ClassificationRuleRowData>  $rules
     */
    private function rulesOf(array $rules): LayoutPartData
    {
        $heading = LayoutPartData::build()->asText()->key('heading')->value('Rules')->style('heading')->finish();

        if ($rules === []) {
            return LayoutPartData::build()
                ->asBox()
                ->key('rules')
                ->style('section')
                ->children(
                    $heading,
                    LayoutPartData::build()
                    ->asNotice()
                    ->key('empty')
                    ->style('empty')
                    ->title('The project has no rule of its own yet.')
                    ->finish(),
                )
                ->finish();
        }

        return LayoutPartData::build()
            ->asBox()
            ->key('rules')
            ->style('section')
            ->children(
                $heading,
                LayoutPartData::build()
                ->asCollection()
                ->key('rows')
                ->style('list')
                ->rows(
                    array_map(
                        fn (ClassificationRuleRowData $rule) => LayoutRowData::build()
                            ->key($rule->id)
                            ->label("{$rule->ruleId} ({$rule->owner}) revision {$rule->revision}")
                            ->value($rule->state)
                            ->detail($rule->reason)
                            ->finish(),
                        $rules,
                    ),
                )
                ->finish(),
            )
            ->finish();
    }
}
