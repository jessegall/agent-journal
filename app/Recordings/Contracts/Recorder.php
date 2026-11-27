<?php

declare(strict_types=1);

namespace App\Recordings\Contracts;

use App\Recordings\RecordingOpening;

/**
 * The recorder of one wire, such as a driver's pipes and terminals, the Docker daemon or the host protocol: it records
 * each exchange on its wire, what went in and what came out with their timing, while AGENTS_RECORDING is on, into the
 * one format the Go mocks replay, with fake values in place of real ones (RecordingDrafts, RecordingFakes).
 */
interface Recorder
{
    /**
     * Whether recording is on, as AGENTS_RECORDING says.
     */
    public function isOn(): bool;

    /**
     * Called when an exchange on the wire opens: starts its recording, before anything goes in or comes out.
     */
    public function begin(string $exchangeId, RecordingOpening $opening): void;

    /**
     * Called with what went into the exchange, such as a line written to a program or a request sent.
     */
    public function wentIn(string $exchangeId, string $bytes): void;

    /**
     * Called with what came out of the exchange, on the stream it came out on, such as stdout or a response.
     */
    public function cameOut(string $exchangeId, string $stream, string $bytes): void;

    /**
     * Called when the exchange ended, with its exit code: writes its recording with fake values.
     */
    public function end(string $exchangeId, int $exitCode): void;
}
