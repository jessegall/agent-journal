<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Recordings\Contracts\Recorder;
use App\Recordings\Enums\Wire;
use Illuminate\Http\Request;

/**
 * The recorder of one wire of calls: each caller's calls are one exchange, opened by its first call, every call one
 * asked and one answered line of its draft, a long poll among them.
 */
final readonly class CallRecorder implements Recorder
{
    public function __construct(private Wire $wire, private RecordingDrafts $drafts) {}

    public function wire(): Wire
    {
        return $this->wire;
    }

    /**
     * The exchange a request belongs to: its caller, named by its credential's digest, never the credential.
     */
    public function exchangeOf(Request $request): string
    {
        return 'caller-'.substr(hash('sha256', (string) $request->bearerToken()), 0, 16);
    }

    public function begin(string $exchange, RecordingOpening $opening): void
    {
        $this->drafts->begin($this->wire, $exchange, $opening);
    }

    /**
     * Adds the event to the exchange, opening its draft with its first event.
     */
    public function add(string $exchange, RecordedEvent $event): void
    {
        $this->drafts->begin($this->wire, $exchange, RecordingOpening::ofCalls($this->wire, $exchange));
        $this->drafts->add($this->wire, $exchange, $event);
    }

    /**
     * A wire of calls ends with its run, so an exchange on it has nothing more to write when it ends.
     */
    public function end(string $exchange, int $exitCode): void {}
}
