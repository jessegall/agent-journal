<?php

declare(strict_types=1);

namespace App\Connections\Support;

use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Connections\Calls\RunProjectCommandCall;
use App\Connections\Commands\FinishProjectCommandRun;
use App\Connections\Commands\RecordProjectCommandProcess;
use App\Connections\Commands\StartProjectCommandRun;
use App\Connections\Exceptions\VerbNotServed;
use App\Connections\Models\ProjectBinding;
use App\Connections\Values\CommandFrame;
use App\Processes\Support\JournalRoutes;
use Symfony\Component\Process\Process;

/**
 * Runs a connected machine's journal verb on the server the way the local journal command runs it: the same artisan
 * client, signing its calls with the calling start's own token, so the verb goes through the ordinary command
 * entrance and policies as that agent and never as the journal itself. Only journal routes that need nothing beyond
 * the journal run here; a request key runs once.
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
     * Runs the verb for the agent, or answers the frames its request key already recorded, in order and ending with
     * the exit frame; a verb that is no journal route or a binding that is not the agent's own is refused first.
     *
     * @param  array<string, string>  $startEnvironment  the calling start's own credentials, without the journal's URL
     * @return list<CommandFrame>
     *
     * @throws VerbNotServed
     */
    public function run(RunProjectCommandCall $call, string $agentId, array $startEnvironment): array
    {
        $this->assertServed($call, $agentId);
        $requestKey = $call->requestKey->value;
        $start = new StartProjectCommandRun($requestKey, $agentId, $call->binding, $call->argv);
        $started = $this->dispatchers->runAsJournal(CommandEntry::HostControl, 'project command', $start);

        if ($started->isRunning && ! $started->isNew) {
            throw VerbNotServed::stillRunning($requestKey);
        }

        if (! $started->isNew) {
            return $started->recorded;
        }

        return $this->execute($call, ['JOURNAL_URL' => $this->journalUrl, ...$startEnvironment]);
    }

    /**
     * @throws VerbNotServed
     */
    private function assertServed(RunProjectCommandCall $call, string $agentId): void
    {
        $routes = $this->routes->routeOf($call->verbName());

        if ($routes === [] || $routes[0]->alsoNeeds !== []) {
            throw VerbNotServed::notAJournalVerb($call->verbName());
        }

        $own = array_map(fn (ProjectBinding $binding) => $binding->id, ProjectBinding::ofMainAgent($agentId));

        if (! in_array($call->binding, $own, true)) {
            throw VerbNotServed::notYourBinding($call->binding);
        }
    }

    /**
     * @param  array<string, string>  $environment
     * @return list<CommandFrame>
     */
    private function execute(RunProjectCommandCall $call, array $environment): array
    {
        $process = new Process(
            ['php', $this->artisan, $call->verbName(), ...array_slice($call->argv, 2)],
            dirname($this->artisan),
            $environment,
            $call->pipedInput(),
            null,
        );

        $frames = [];

        $process->start(function (string $type, string $bytes) use (&$frames): void {
            $frames[] = CommandFrame::output(count($frames) + 1, $type === Process::ERR ? 'stderr' : 'stdout', $bytes);
        });

        $record = new RecordProjectCommandProcess($call->requestKey->value, (int) $process->getPid());
        $this->dispatchers->runAsJournal(CommandEntry::HostControl, 'project command', $record);
        $code = $process->wait();
        $frames[] = CommandFrame::exit(count($frames) + 1, $code);

        $finish = new FinishProjectCommandRun($call->requestKey->value, $frames, $code);
        $this->dispatchers->runAsJournal(CommandEntry::HostControl, 'project command', $finish);

        return $frames;
    }
}
