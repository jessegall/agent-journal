<?php

declare(strict_types=1);

namespace Domain\Plans\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Domain\Plans\Api\ListAssignedPlansPayload;
use Domain\Plans\Api\PlanApi;
use Domain\Plans\Data\AssignedPlanCardData;
use Illuminate\Console\Command;

/**
 * Lists the plans the calling agent holds, asked of the journal over a signed call with the start's token: the
 * start decides who calls, never an option.
 */
#[JournalRoute(JournalRouteType::Read)]
final class AssignedPlansCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'plan:assigned {--search= : Words in the title} {--state=* : Only these states} {--page=1} {--per-page=20} {--json : Print the answer as JSON}';

    protected $description = 'List the plans the calling agent holds';

    public function handle(PlanApi $plans): int
    {
        $search = (string) $this->option('search');

        $call = ListAssignedPlansPayload::from([
            'search' => $search === '' ? null : $search,
            'states' => array_values(array_map(strval(...), (array) $this->option('state'))),
            'page' => (int) $this->option('page'),
            'perPage' => (int) $this->option('per-page'),
        ]);

        if ($this->option('json') === true) {
            return $this->runCall($call);
        }

        return $this->runReport(function () use ($plans, $call): int {
            $assignedPlanPage = $plans->listAssignedPlans($call->search, $call->states, $call->page, $call->perPage);

            $headers = [
                'Id',
                'Title',
                'Type',
                'State',
                'Holder',
                'Reference',
            ];

            $this->table($headers, array_map(fn (AssignedPlanCardData $card) => [
                $card->id,
                $card->title,
                $card->type->value,
                $card->status->value,
                $card->holder->label(),
                $card->holder->reference,
            ], $assignedPlanPage->cards));

            $this->line(
                "Page {$assignedPlanPage->page}: ".count($assignedPlanPage->cards)." of {$assignedPlanPage->total}",
            );

            return self::SUCCESS;
        });
    }
}
