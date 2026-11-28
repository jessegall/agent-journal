<?php

declare(strict_types=1);

namespace App\Recordings\Contracts;

use App\Recordings\Enums\Wire;
use App\Recordings\RecordedEvent;
use App\Recordings\RecordingOpening;

/**
 * Keeps what crosses one wire while recording is on, an exchange at a time; the wire's tap calls nothing else.
 */
interface Recorder
{
    /**
     * The wire this recorder keeps the exchanges of.
     */
    public function wire(): Wire;

    /**
     * Opens the exchange's draft, before anything crosses the wire.
     */
    public function begin(string $exchange, RecordingOpening $opening): void;

    /**
     * Adds what crossed: typed, printed, resized, asked or answered.
     */
    public function add(string $exchange, RecordedEvent $event): void;

    /**
     * Ends the exchange with the code its process exited with.
     */
    public function end(string $exchange, int $exitCode): void;
}
