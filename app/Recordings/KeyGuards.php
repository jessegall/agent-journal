<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRoute;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Hosts\Protocol\Payloads\HostKeyWritePayload;
use App\Hosts\Protocol\Payloads\HostOutputPayload;
use App\Recordings\Enums\RecordedEventType;

/**
 * The row guards of a faked host exchange's key writes, each given the hash of the rows the journal was last shown of
 * its process: faking turns the hash the journal took of the real rows into a fake no host can match, while the rows
 * the recording keeps are the faked ones a played host shows (the hash as hostapi.Screen.RowsHash takes it).
 */
final readonly class KeyGuards
{
    /**
     * The pattern of a process's output path, with the process.
     */
    private const string OUTPUT_PATH = '#^/host/processes/([^/]+)/output$#';

    public static function hashedIn(CutExchange $exchange): CutExchange
    {
        $shownRows = [];
        $hashes = [];

        foreach ($exchange->events as $event) {
            $call = $event->call;

            if ($call === null || $call->body === '') {
                continue;
            }

            if (
                $event->type === RecordedEventType::Asked
                && preg_match(self::OUTPUT_PATH, $call->path, $process) === 1
            ) {
                $frames = HostOutputPayload::from($call->body)->frames;
                $shownRows[$process[1]] = $frames === [] ? $shownRows[$process[1]] ?? [] : end($frames)->rows;
            }

            if ($event->type === RecordedEventType::Answered && HostRoute::ClaimInstruction->matchesPath($call->path)) {
                $claim = HostClaimedInstructionsPayload::from($call->body);
                $hashes = [
                    ...$hashes,
                    ...self::guardHashes($claim, $shownRows),
                ];
            }
        }

        return $exchange->withBodies(fn (string $body) => strtr($body, $hashes));
    }

    /**
     * Each faked guard hash of the claim's key writes, by the hash of the rows of its process it guards.
     *
     * @param  array<string, list<string>>  $shownRows
     * @return array<string, string>
     */
    private static function guardHashes(HostClaimedInstructionsPayload $claim, array $shownRows): array
    {
        $hashes = [];

        foreach ($claim->instructions as $instruction) {
            if ($instruction->type !== HostInstructionType::WriteKeys->value) {
                continue;
            }

            $guard = HostKeyWritePayload::from($instruction->payload)->ifRows;
            $rows = $shownRows[$instruction->processId] ?? [];

            if ($guard === null || $rows === []) {
                continue;
            }

            $from = max(0, $guard->from);
            $to = min($guard->to, count($rows) - 1);
            $hashes[$guard->hash] = hash('sha256', implode("\n", array_slice($rows, $from, $to - $from + 1)));
        }

        return $hashes;
    }
}
