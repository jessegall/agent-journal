<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Console;

use App\Core\Agents\Contracts\AgentRequestSender;
use App\Core\Agents\Exceptions\AgentRequestFailed;
use App\Domain\Tasks\Http\Data\AssignedTaskCardData;
use App\Domain\Tasks\Http\Data\AssignedTaskListData;
use Illuminate\Console\Command;

/**
 * Lists the tasks the calling agent holds, asked of the journal over a signed call with the launch's token: the
 * launch decides who calls, never an option.
 */
final class AssignedTasksCommand extends Command
{
    protected $signature = 'task:assigned {--search= : Words in the title} {--state=* : Only these states} {--page=1} {--per-page=20} {--json : Print the answer as JSON}';

    protected $description = 'List the tasks the calling agent holds';

    public function handle(AgentRequestSender $journal): int
    {
        try {
            $reply = $journal->send('/agent/tasks/assigned', [
                'search' => (string) $this->option('search'),
                'states' => (array) $this->option('state'),
                'page' => (int) $this->option('page'),
                'perPage' => (int) $this->option('per-page'),
            ]);
        } catch (AgentRequestFailed $failure) {
            $this->error($failure->getMessage());

            return self::FAILURE;
        }

        if ($this->option('json')) {
            $this->line(json_encode($reply->body, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $list = AssignedTaskListData::from($reply->body);
        $this->table(['Id', 'Title', 'State', 'Holder', 'Reference'], array_map(fn (AssignedTaskCardData $card) => [$card->id, $card->title, $card->state->value, $card->holder->label(), $card->holder->reference], $list->cards));
        $this->line("Page {$list->page}: ".count($list->cards)." of {$list->total}");

        return self::SUCCESS;
    }
}
