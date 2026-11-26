<?php

declare(strict_types=1);

namespace Domain\Tasks\Console\Commands;

use App\Bus\Attributes\Console\JournalRoute;
use App\CommandRules\Enums\JournalRouteType;
use App\Console\Concerns\RunsApiPipelines;
use Domain\Tasks\Api\ListAssignedTasksPayload;
use Domain\Tasks\Api\TaskApi;
use Domain\Tasks\Data\AssignedTaskCardData;
use Illuminate\Console\Command;

/**
 * Lists the tasks the calling agent holds, asked of the journal over a signed call with the start's token: the
 * start decides who calls, never an option.
 */
#[JournalRoute(JournalRouteType::Read)]
final class AssignedTasksCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'task:assigned {--search= : Words in the title} {--state=* : Only these states} {--page=1} {--per-page=20} {--json : Print the answer as JSON}';

    protected $description = 'List the tasks the calling agent holds';

    public function handle(TaskApi $tasks): int
    {
        $search = (string) $this->option('search');

        $call = ListAssignedTasksPayload::from([
            'search' => $search === '' ? null : $search,
            'states' => array_values(array_map(strval(...), (array) $this->option('state'))),
            'page' => (int) $this->option('page'),
            'perPage' => (int) $this->option('per-page'),
        ]);

        if ($this->option('json') === true) {
            return $this->runCall($call);
        }

        return $this->runReport(function () use ($tasks, $call): int {
            $assignedTaskPage = $tasks->listAssignedTasks($call->search, $call->states, $call->page, $call->perPage);

            $this->table(['Id', 'Title', 'State', 'Holder', 'Reference'], array_map(fn (AssignedTaskCardData $card) => [
                $card->id,
                $card->title,
                $card->status->value,
                $card->holder->label(),
                $card->holder->reference,
            ], $assignedTaskPage->cards));

            $this->line(
                "Page {$assignedTaskPage->page}: ".count($assignedTaskPage->cards)." of {$assignedTaskPage->total}",
            );

            foreach ($assignedTaskPage->cards as $card) {
                if ($card->execution !== null) {
                    $this->line("{$card->id}: {$card->execution->label()}");
                }
            }

            return self::SUCCESS;
        });
    }
}
