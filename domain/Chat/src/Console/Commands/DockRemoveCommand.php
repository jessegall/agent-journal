<?php

declare(strict_types=1);

namespace Domain\Chat\Console\Commands;

use App\Attributes\JournalRoute;
use App\Console\Concerns\RunsCallPipelines;
use App\Enums\JournalRouteType;
use Domain\Chat\Calls\DockRemoveCall;
use Domain\Chat\Console\Concerns\ChoosesChat;
use Illuminate\Console\Command;

#[JournalRoute(JournalRouteType::Write)]
final class DockRemoveCommand extends Command
{
    use ChoosesChat;
    use RunsCallPipelines;

    protected $signature = 'dock:remove {placement : The placement id that dock list prints} {--chat= : The inbox id of the chat, when you are in several} {--request-key= : Send again under the key a failed attempt printed} {--json}';

    protected $description = 'Undock a placement from your conversation; the record itself stays';

    protected $help = 'Example: journal dock remove 01JD8X0G9M3QZ6V4K2PLACEMENT prints removed, or unavailable when nothing was there';

    public function handle(): int
    {
        return $this->runCall(DockRemoveCall::from([
            'placement' => (string) $this->argument('placement'),
            'chat' => $this->chosenChat(),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
