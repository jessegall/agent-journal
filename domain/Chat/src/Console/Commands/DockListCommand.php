<?php

declare(strict_types=1);

namespace Domain\Chat\Console\Commands;

use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Domain\Chat\Api\DockListPayload;
use Domain\Chat\Console\Concerns\ChoosesChat;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Read)]
final class DockListCommand extends Command
{
    use ChoosesChat;
    use RunsApiPipelines;

    protected $signature = 'dock:list'
        .' {--limit=100 : How many placements to list, at most 100}'
        .' {--chat= : The inbox id of the chat, when you are in several}'
        .' {--json}';

    protected $description = 'List the records docked in your conversation: placement, type, id, title and state';

    protected $help = 'Example: journal dock list prints each placement with its type, source id, title and whether it shows';

    public function handle(): int
    {
        return $this->runCall(DockListPayload::from([
            'limit' => (int) $this->option('limit'),
            'chat' => $this->chosenChat(),
        ]));
    }
}
