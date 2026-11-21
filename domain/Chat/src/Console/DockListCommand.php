<?php

declare(strict_types=1);

namespace Domain\Chat\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Domain\Chat\Calls\DockListCall;
use Domain\Chat\Console\Concerns\ChoosesChat;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class DockListCommand extends Command
{
    use ChoosesChat;
    use RunsCallPipelines;

    protected $signature = 'dock:list'
        .' {--limit=100 : How many placements to list, at most 100}'
        .' {--chat= : The conversation, when you take part in several}'
        .' {--json}';

    protected $description = 'List the records docked in your conversation: placement, type, id, title and state';

    protected $help = 'Example: journal dock list prints each placement with its type, source id, title and whether it shows';

    public function handle(): int
    {
        return $this->runCall(DockListCall::from([
            'limit' => (int) $this->option('limit'),
            'chat' => $this->chosenChat(),
        ]));
    }
}
