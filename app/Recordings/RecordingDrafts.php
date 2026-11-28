<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Files\Values\Depth;
use App\Recordings\Enums\RecordedEventType;
use App\Recordings\Enums\Wire;
use App\Recordings\Scenarios\Scenario;
use App\Values\FilePath;
use Carbon\CarbonImmutable;

/**
 * The one store every wire's recorder writes through, switched on by agents.recording: within a recording run, each
 * exchange's draft gets its opening and each event as it happens, from any container of the journal, under its wire.
 * Drafts outside a run are never kept, and a new run removes the drafts an interrupted one left.
 */
final readonly class RecordingDrafts
{
    /**
     * Where the drafts of the exchanges being recorded are kept, in the project, so every container of the journal
     * adds to the same draft.
     */
    public const string DRAFTS = 'storage/recordings/drafts';

    /**
     * The file whose presence switches recording on: the record script makes and removes it, and the running journal
     * reads it at each play, so switching restarts nothing.
     */
    public const string SWITCH = 'storage/recordings/.enabled';

    private FilePath $drafts;

    public function __construct(private Files $files)
    {
        $this->drafts = FilePath::in(Place::Project, self::DRAFTS);
    }

    /**
     * The moment an event happens, as the microseconds since the epoch every event is timed by.
     */
    public static function moment(): int
    {
        return RecordingOpening::microsecondsOf(CarbonImmutable::now());
    }

    public function isOn(): bool
    {
        return $this->files->exists(FilePath::in(Place::Project, self::SWITCH));
    }

    /**
     * Opens a recording run of the scenario: the drafts an earlier run left are removed first, so an interrupted run
     * leaves nothing half written.
     */
    public function openRun(Scenario $scenario): void
    {
        if (! $this->isOn()) {
            return;
        }

        if ($this->files->isFolder($this->drafts)) {
            $this->files->deleteFolder($this->drafts, Depth::levels(Depth::LEVEL_LIMIT));
        }

        $this->files->makeFolder($this->drafts, Permissions::Shared);
        $this->writeRun(['scenario' => $scenario->name, 'opened_at' => self::moment(), 'closed_at' => null]);
    }

    /**
     * Closes the open run; its drafts wait for the finisher.
     */
    public function closeRun(): void
    {
        if (! $this->isRunOpen()) {
            return;
        }

        $this->writeRun([...$this->files->readJson($this->runFile()), 'closed_at' => self::moment()]);
    }

    public function isRunOpen(): bool
    {
        $run = $this->runFile();

        return $this->isOn() && $this->files->exists($run) && $this->files->readJson($run)['closed_at'] === null;
    }

    public function isRecordingConnectedFolder(): bool
    {
        if (! $this->isRunOpen()) {
            return false;
        }

        $run = $this->files->readJson($this->runFile());

        return str_starts_with((string) $run['scenario'], Scenario::CONNECTED.'/');
    }

    public function hasSessionStart(string $source, int $after): bool
    {
        $folder = $this->drafts->child(Wire::Hooks->value);

        if (! $this->files->isFolder($folder)) {
            return false;
        }

        foreach ($this->files->list($folder, pattern: '*.jsonl')->paths() as $draft) {
            $lines = $this->files->locked($this->lockOf($draft), fn () => $this->files->readJsonLines($draft));

            foreach (array_slice($lines, 1) as $line) {
                $event = RecordedEvent::fromLine($line);

                if ($event->at < $after || $event->type !== RecordedEventType::Asked || $event->call === null) {
                    continue;
                }

                $body = json_decode($event->call->body, true);

                if (($body['hook_event_name'] ?? '') === 'SessionStart' && ($body['source'] ?? '') === $source) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Starts the exchange's draft on the wire with its opening, while a run is open; once started it is kept.
     */
    public function begin(Wire $wire, string $exchange, RecordingOpening $opening): void
    {
        $draft = $this->draftOf($wire, $exchange);

        if (! $this->isRunOpen() || $this->files->exists($draft)) {
            return;
        }

        $this->files->makeFolder($this->drafts->child($wire->value), Permissions::Shared);

        $this->files->locked($this->lockOf($draft), fn () => $this->files->write(
            $draft,
            json_encode($opening, JSON_THROW_ON_ERROR)."\n",
        ));
    }

    /**
     * Adds the event to the exchange's draft, one line at a time under its lock; an exchange with no draft is not
     * recorded.
     */
    public function add(Wire $wire, string $exchange, RecordedEvent $event): void
    {
        $draft = $this->draftOf($wire, $exchange);

        if (! $this->isRunOpen() || ! $this->files->exists($draft)) {
            return;
        }

        $this->files->locked($this->lockOf($draft), fn () => $this->files->append(
            $draft,
            json_encode($event, JSON_THROW_ON_ERROR)."\n",
        ));
    }

    /**
     * The closed run as the finisher takes it: its scenario, its window, and each exchange's opening and events by its
     * wire.
     */
    public function run(): RecordingRun
    {
        $run = $this->files->readJson($this->runFile());
        $exchanges = [];

        foreach (Wire::cases() as $wire) {
            $folder = $this->drafts->child($wire->value);

            if (! $this->files->isFolder($folder)) {
                continue;
            }

            foreach ($this->files->list($folder, pattern: '*.jsonl')->paths() as $draft) {
                $lines = $this->files->readJsonLines($draft);
                $opening = RecordingOpening::fromLine((array) array_shift($lines));
                $events = array_map(fn (array $line) => RecordedEvent::fromLine($line), $lines);

                $exchanges[] = new CutExchange($opening, $events, null);
            }
        }

        return new RecordingRun(
            (string) $run['scenario'],
            (int) $run['opened_at'],
            (int) $run['closed_at'],
            $exchanges,
        );
    }

    /**
     * Removes the run's drafts once the finisher wrote its recording.
     */
    public function clear(): void
    {
        if ($this->files->isFolder($this->drafts)) {
            $this->files->deleteFolder($this->drafts, Depth::levels(Depth::LEVEL_LIMIT));
        }
    }

    private function draftOf(Wire $wire, string $exchange): FilePath
    {
        return $this->drafts->child("{$wire->value}/{$exchange}.jsonl");
    }

    private function lockOf(FilePath $draft): FilePath
    {
        return FilePath::in($draft->place, "{$draft->relative}.lock");
    }

    private function runFile(): FilePath
    {
        return $this->drafts->child('run.json');
    }

    /**
     * @param  array<string, mixed>  $run
     */
    private function writeRun(array $run): void
    {
        $this->files->write($this->runFile(), json_encode($run, JSON_THROW_ON_ERROR)."\n");
    }
}
