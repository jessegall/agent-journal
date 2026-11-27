<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Files\Values\Depth;
use App\Hosts\HostProtocolCheck;
use App\Hosts\Protocol\HostRoute;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Recordings\Enums\RecordedEventType;
use App\Recordings\Enums\RecordingMode;
use App\Recordings\Enums\Wire;
use App\Recordings\Exceptions\HostProtocolDrifted;
use App\Recordings\Exceptions\RecordingUnfinished;
use App\Time\Contracts\ServerClock;
use App\Values\FilePath;
use Illuminate\Container\Attributes\Config;
use Illuminate\Process\Factory as ProcessFactory;

/**
 * Turns a closed recording run into its scenario's folder: a current protocol, driver exchanges cut out, one set of
 * fakes, the generated readers' judgement and no leak, or nothing is written and the earlier folder stays.
 */
final readonly class RecordingFinisher
{
    /**
     * Where the test host binary is built, which renders a terminal's frames as its screen showed them.
     */
    private const string RENDERER = 'storage/framework/test-host';

    public function __construct(
        private Files $files,
        private HostProtocolCheck $protocolCheck,
        private DriverExchanges $driverExchanges,
        private RecordedProtocol $protocol,
        private AgentImagePrograms $imagePrograms,
        private Recordings $recordings,
        private ServerClock $clock,
        private ProcessFactory $processes,
        #[Config('agents.agent_image')]
        private string $agentImage,
    ) {}

    /**
     * @throws HostProtocolDrifted
     */
    public function finish(RecordingRun $run): FilePath
    {
        $drifted = $this->protocolCheck->drifted();

        if ($drifted !== []) {
            throw HostProtocolDrifted::naming($drifted);
        }

        $fakes = new RecordingFakes($run->environment());

        $exchanges = array_map(
            fn (CutExchange $exchange) => $this->resigned($exchange->fakedBy($fakes), $fakes),
            $this->exchangesOf($run, $fakes),
        );

        $manifest = RecordingManifest::of(
            $this->files->digest(FilePath::in(Place::Project, Recordings::SCENARIOS."/{$run->scenario}.json")),
            $run->driver(),
            $this->recordings->buildOf($run->driver()),
            $this->imagePrograms->hash(),
            $this->clock->now()->toIso8601String(),
            array_keys($exchanges),
        );

        $recording = ScenarioRecording::ofExchanges($manifest, $exchanges);

        $this->protocol->assertKept($recording);
        $text = implode("\n", array_map(fn (CutExchange $exchange) => $exchange->text(), $exchanges));
        $fakes->assertNoLeak($text, $run->knownValues());

        return $this->written($run, $manifest, $recording, $fakes);
    }

    /**
     * The run's exchanges in order, each named by its place and what it is, the driver exchanges cut out of the
     * host's; each opening is clean.
     *
     * @return array<string, CutExchange>
     */
    private function exchangesOf(RecordingRun $run, RecordingFakes $fakes): array
    {
        $windowed = $run->windowed();

        $hostEvents = array_merge(...array_map(
            fn (CutExchange $exchange) => $exchange->opening->wire === Wire::Host ? $exchange->events : [],
            $windowed,
        ));

        $all = [
            ...$windowed,
            ...array_values($this->driverExchanges->cutFrom($hostEvents, $fakes)),
        ];

        $named = [];

        foreach ($all as $index => $exchange) {
            $fakes->assertClean($exchange->opening, $this->agentImage);
            $name = sprintf('%02d-%s-%s', $index + 1, $exchange->opening->wire->value, $exchange->opening->exchange);
            $named[$name] = $exchange;
        }

        return $named;
    }

    /**
     * The exchange with each claim's instructions signed again over their faked payloads.
     */
    private function resigned(CutExchange $exchange, RecordingFakes $fakes): CutExchange
    {
        $events = array_map(function (RecordedEvent $event) use ($fakes) {
            $call = $event->call;
            $isClaim = $call !== null && HostRoute::ClaimInstruction->matchesPath($call->path) && $call->body !== '';

            if (! $isClaim || $event->type !== RecordedEventType::Answered) {
                return $event;
            }

            $claim = $fakes->resignedClaim(HostClaimedInstructionsPayload::from($call->body));

            return $event->withCall($call->withBody((string) json_encode($claim)));
        }, $exchange->events);

        return new CutExchange($exchange->opening, $events, $exchange->exitCode);
    }

    /**
     * Writes the recording beside the earlier one, renders its terminals' frames, puts it in the earlier one's place
     * and clears nothing else.
     */
    private function written(
        RecordingRun $run,
        RecordingManifest $manifest,
        ScenarioRecording $recording,
        RecordingFakes $fakes,
    ): FilePath {
        $folder = $this->recordings->folderOf($run->driver(), $run->name());

        $next = FilePath::in(Place::Project, "{$folder->relative}.next");
        $fixture = new GoFixture();

        $this->files->makeFolder($next, Permissions::Shared);
        $this->files->write($next->child('scenario.json'), $this->encoded($manifest));

        foreach ($manifest->exchanges as $name) {
            $exchange = $recording->exchange($name);
            $exchangeFolder = $next->child("exchanges/{$name}");
            $this->files->makeFolder($exchangeFolder, Permissions::Shared);

            $this->files->write($exchangeFolder->child('exchange.json'), $this->encoded([
                'opening' => $exchange->opening,
                'events' => $exchange->events,
                'exit_code' => $exchange->exitCode,
            ]));

            if ($exchange->opening->mode !== RecordingMode::Calls) {
                $this->files->write($exchangeFolder->child('fixture.json'), $this->encoded(
                    $fixture->of($exchange->opening, $exchange->events, $exchange->exitCode ?? 0, $fakes),
                ));
            }
        }

        $hasTerminal = array_filter(
            $manifest->exchanges,
            fn (string $name) => $recording->exchange($name)->isTerminal(),
        ) !== [];

        if ($hasTerminal) {
            $this->renderFrames($next);
        }

        if ($this->files->isFolder($folder)) {
            $this->files->deleteFolder($folder, Depth::levels(Depth::LEVEL_LIMIT));
        }

        $this->files->move($next, $folder);

        return $folder;
    }

    /**
     * Renders frames.json beside each terminal's fixture with the test host, as the screens showed them.
     *
     * @throws RecordingUnfinished
     */
    private function renderFrames(FilePath $folder): void
    {
        $hosts = $this->files->list(FilePath::in(Place::Project, self::RENDERER), pattern: 'journal-agent-*')->paths();

        if ($hosts === []) {
            throw RecordingUnfinished::framesUnrendered('no test host is built: run sh scripts/go-tests.sh');
        }

        $run = $this->processes->newPendingProcess()->run([
            $this->files->realPath($hosts[0]),
            'recording',
            'render',
            $this->files->realPath($folder),
        ]);

        if (! $run->successful()) {
            throw RecordingUnfinished::framesUnrendered($run->errorOutput());
        }
    }

    private function encoded(mixed $value): string
    {
        return json_encode($value, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n";
    }
}
