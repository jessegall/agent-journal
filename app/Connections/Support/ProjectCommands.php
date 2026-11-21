<?php

declare(strict_types=1);

namespace App\Connections\Support;

use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Connections\Commands\FinishProjectCommandRun;
use App\Connections\Commands\RecordProjectCommandProcess;
use App\Connections\Commands\StartProjectCommandRun;
use App\Connections\Exceptions\VerbNotServed;
use App\Connections\Models\ProjectBinding;
use App\Connections\Values\CommandFrame;
use App\Connections\Values\CommandRunStart;
use App\Http\Requests\Connections\ProjectCommandRequest;
use App\Processes\Support\JournalRoutes;
use Closure;
use Symfony\Component\Process\Process;

/**
 * Runs a connected machine's journal verb on the server the way the local journal command runs it: the same artisan
 * client, signing its calls with the calling start's own token, so the verb goes through the ordinary command
 * entrance and policies as that agent and never as the journal itself. Only journal routes that need nothing beyond
 * the journal run here; a request id runs once.
 */
final readonly class ProjectCommands
{
    public function __construct(
        private JournalRoutes $routes,
        private EntryDispatchers $dispatchers,
        private string $artisan,
        private string $journalUrl,
    ) {}

    /**
     * Runs the verb, or answers the frames its request id already recorded, handing each frame to emit in order.
     *
     * @param  Closure(CommandFrame): void  $emit
     *
     * @throws VerbNotServed
     */
    public function run(ProjectCommandRequest $request, string $agentId, Closure $emit): void
    {
        $this->assertServed($request, $agentId);
        $start = new StartProjectCommandRun($request->requestId(), $agentId, $request->bindingId(), $request->argv());
        $started = $this->dispatchers->runAsJournal(CommandEntry::HostControl, 'project command', $start);

        if (! $started->isNew) {
            $this->replay($started, $request->requestId(), $emit);

            return;
        }

        $this->execute($request, $emit);
    }

    /**
     * @throws VerbNotServed
     */
    private function assertServed(ProjectCommandRequest $request, string $agentId): void
    {
        $routes = $this->routes->routeOf($request->verbName());

        if ($routes === [] || $routes[0]->alsoNeeds !== []) {
            throw VerbNotServed::notAJournalVerb($request->verbName());
        }

        $own = array_map(fn (ProjectBinding $binding) => $binding->id, ProjectBinding::ofMainAgent($agentId));

        if (! in_array($request->bindingId(), $own, true)) {
            throw VerbNotServed::notYourBinding($request->bindingId());
        }
    }

    /**
     * @param  Closure(CommandFrame): void  $emit
     *
     * @throws VerbNotServed
     */
    private function replay(CommandRunStart $earlier, string $requestId, Closure $emit): void
    {
        if ($earlier->isRunning) {
            throw VerbNotServed::stillRunning($requestId);
        }

        foreach ($earlier->recorded as $frame) {
            $emit($frame);
        }
    }

    /**
     * @param  Closure(CommandFrame): void  $emit
     */
    private function execute(ProjectCommandRequest $request, Closure $emit): void
    {
        $argv = $request->argv();
        $process = new Process(
            ['php', $this->artisan, $request->verbName(), ...array_slice($argv, 2)],
            dirname($this->artisan),
            $request->startEnvironment($this->journalUrl),
            $request->stdin(),
            null,
        );
        $frames = [];
        $process->start(function (string $type, string $bytes) use (&$frames, $emit): void {
            $frame = CommandFrame::output(count($frames) + 1, $type === Process::ERR ? 'stderr' : 'stdout', $bytes);
            $frames[] = $frame;
            $emit($frame);
        });
        $record = new RecordProjectCommandProcess($request->requestId(), (int) $process->getPid());
        $this->dispatchers->runAsJournal(CommandEntry::HostControl, 'project command', $record);
        $code = $process->wait();
        $exit = CommandFrame::exit(count($frames) + 1, $code);
        $frames[] = $exit;
        $emit($exit);

        $finish = new FinishProjectCommandRun($request->requestId(), $frames, $code);
        $this->dispatchers->runAsJournal(CommandEntry::HostControl, 'project command', $finish);
    }
}
