<?php

declare(strict_types=1);

namespace App\Support;

use App\Calls\Connections\ProjectCommandFrame;
use App\Calls\Connections\RunProjectCommandCall;
use App\Commands\Projects\FinishProjectCommandRun\FinishProjectCommandRunCommand;
use App\Commands\Projects\RecordProjectCommandProcess\RecordProjectCommandProcessCommand;
use App\Commands\Projects\StartProjectCommandRun\StartProjectCommandRunCommand;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Connections\CommandRunState;
use App\Exceptions\VerbNotServed;
use App\Models\Projects\ProjectBinding;
use App\Values\CommandRunStart;
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
        private JournalCommands $dispatchers,
        private CommandRunEvidence $evidence,
        private string $artisanPath,
        private string $journalUrl,
    ) {}

    /**
     * Runs the verb for the agent, or answers the frames its request key already recorded, in order and ending with
     * the exit frame; a verb that is no journal route or a binding that is not the agent's own is refused first, and
     * a request key given for another operation, still running, interrupted or of unknown outcome is refused.
     *
     * @param  array<string, string>  $startEnvironment  the calling start's own credentials, without the journal's URL
     * @return list<ProjectCommandFrame>
     *
     * @throws VerbNotServed
     */
    public function run(RunProjectCommandCall $call, string $agentId, array $startEnvironment): array
    {
        $this->assertServed($call, $agentId);
        $requestKey = $call->requestKey->value;

        $start = new StartProjectCommandRunCommand(
            $requestKey,
            $agentId,
            $call->bindingId,
            $call->argv,
            $call->fingerprintFor($agentId),
            $this->evidence->currentWorker(),
        );

        $started = $this->dispatchers->runAsJournal(CommandEntry::HostControl, 'project command', $start);

        if ($started->isNew) {
            return $this->execute($call, [
                'JOURNAL_URL' => $this->journalUrl,
                ...$startEnvironment,
            ]);
        }

        return $this->earlierFrames($requestKey, $started);
    }

    /**
     * The frames an earlier run of the request key kept, once it settled with an outcome.
     *
     * @return list<ProjectCommandFrame>
     *
     * @throws VerbNotServed
     */
    private function earlierFrames(string $requestKey, CommandRunStart $started): array
    {
        if ($started->state->isActive()) {
            throw VerbNotServed::stillRunning($requestKey);
        }

        if ($started->state === CommandRunState::Interrupted) {
            throw VerbNotServed::interrupted($requestKey);
        }

        if ($started->state === CommandRunState::Unknown) {
            throw VerbNotServed::outcomeUnknown($requestKey);
        }

        return $started->recordedFrames;
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

        $own = array_filter(
            ProjectBinding::ofMainAgent($agentId),
            fn (ProjectBinding $binding) => $binding->id === $call->bindingId,
        );

        if ($own === []) {
            throw VerbNotServed::notYourBinding($call->bindingId);
        }

        foreach ($own as $binding) {
            if ($binding->isEnvironmentUnassigned()) {
                throw VerbNotServed::environmentUnassigned($binding->id);
            }

            if (! $binding->isReconciled()) {
                throw VerbNotServed::notReconciled($binding->id);
            }
        }
    }

    /**
     * @param  array<string, string>  $environment
     * @return list<ProjectCommandFrame>
     */
    private function execute(RunProjectCommandCall $call, array $environment): array
    {
        $process = new Process(
            [
                'php',
                $this->artisanPath,
                $call->verbName(),
                ...array_slice($call->argv, 2),
            ],
            dirname($this->artisanPath),
            $environment,
            $call->pipedInput(),
            null,
        );

        $frames = [];

        $process->start(function (string $type, string $bytes) use (&$frames): void {
            $frames[] = ProjectCommandFrame::output(
                count($frames) + 1,
                $type === Process::ERR ? 'stderr' : 'stdout',
                $bytes,
            );
        });

        $record = new RecordProjectCommandProcessCommand($call->requestKey->value, (int) $process->getPid());
        $this->dispatchers->runAsJournal(CommandEntry::HostControl, 'project command', $record);
        $code = $process->wait();
        $frames[] = ProjectCommandFrame::exit(count($frames) + 1, $code);

        $finishRun = new FinishProjectCommandRunCommand($call->requestKey->value, $frames, $code);
        $this->dispatchers->runAsJournal(CommandEntry::HostControl, 'project command', $finishRun);

        return $frames;
    }
}
