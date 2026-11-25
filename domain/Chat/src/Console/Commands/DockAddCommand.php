<?php

declare(strict_types=1);

namespace Domain\Chat\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Domain\Chat\Calls\DockAddCall;
use Domain\Chat\Console\Concerns\ChoosesChat;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class DockAddCommand extends Command
{
    use ChoosesChat;
    use RunsCallPipelines;

    protected $signature = 'dock:add {type : The record type, such as tasks.task or core.messages.message} {id : The id of the record} {--chat= : The inbox id of the chat to dock in, when you are in several} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Dock a record in your conversation, for both sides of it';

    protected $help = 'Example: journal dock add core.messages.message 01JD8X0G9M3QZ6V4K2MESSAGE1 prints added or present with its placement';

    public function handle(): int
    {
        return $this->runCall(DockAddCall::from([
            'type' => (string) $this->argument('type'),
            'id' => (string) $this->argument('id'),
            'chat' => $this->chosenChat(),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
