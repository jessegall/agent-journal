<?php

declare(strict_types=1);

namespace Domain\Tasks\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Tasks\Calls\ListAssignedTasksCall;
use Domain\Tasks\Calls\TaskCalls;
use Domain\Tasks\Http\Data\AssignedTaskCardData;
use Illuminate\Console\Command;

/**
 * Lists the tasks the calling agent holds, asked of the journal over a signed call with the launch's token: the
 * launch decides who calls, never an option.
 */
#[JournalRoute(JournalRouteType::Read)]
final class AssignedTasksCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'task:assigned {--search= : Words in the title} {--state=* : Only these states} {--page=1} {--per-page=20} {--json : Print the answer as JSON}';

    protected $description = 'List the tasks the calling agent holds';

    public function handle(TaskCalls $tasks): int
    {
        $search = (string) $this->option('search');
        $call = ListAssignedTasksCall::from([
            'search' => $search === '' ? null : $search,
            'states' => array_values(array_map(strval(...), (array) $this->option('state'))),
            'page' => (int) $this->option('page'),
            'perPage' => (int) $this->option('per-page'),
        ]);

        if ($this->option('json') === true) {
            return $this->runCall($call);
        }

        return $this->runReport(function () use ($tasks, $call): int {
            $list = $tasks->listAssignedTasks($call->search, $call->states, $call->page, $call->perPage);
            $this->table(['Id', 'Title', 'State', 'Holder', 'Reference'], array_map(fn (AssignedTaskCardData $card) => [
                $card->id,
                $card->title,
                $card->state->value,
                $card->holder->label(),
                $card->holder->reference,
            ], $list->cards));
            $this->line("Page {$list->page}: ".count($list->cards)." of {$list->total}");

            foreach ($list->cards as $card) {
                if ($card->execution !== null) {
                    $this->line("{$card->id}: {$card->execution->label()}");
                }
            }

            return self::SUCCESS;
        });
    }
}
