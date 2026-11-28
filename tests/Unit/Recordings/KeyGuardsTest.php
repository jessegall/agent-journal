<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostRoute;
use App\Hosts\Protocol\Payloads\HostClaimedInstructionsPayload;
use App\Hosts\Protocol\Payloads\HostKeyWritePayload;
use App\Recordings\CutExchange;
use App\Recordings\Enums\RecordedEventType;
use App\Recordings\Enums\Wire;
use App\Recordings\KeyGuards;
use App\Recordings\Recordings;
use Tests\TestCase;

/**
 * A faked key write's row guard gets the hash of the rows the journal was last shown of its process, the hash a played
 * host takes of the same rows.
 */
final class KeyGuardsTest extends TestCase
{
    /**
     * A digest in the shape the recording's fakes have.
     */
    private const string FAKE_HASH = '0000000000000000000000000000000000000000000000000000000000000099';

    public function test_a_faked_guard_hash_becomes_the_hash_of_the_rows_it_guards(): void
    {
        $exchange = $this->recordedHostExchange();
        $guarded = $this->firstGuardHash($exchange);
        $faked = $exchange->withBodies(fn (string $body) => str_replace($guarded, self::FAKE_HASH, $body));

        $hashed = KeyGuards::hashedIn($faked);

        $this->assertSame([$guarded, false], [$this->firstGuardHash($hashed), str_contains($hashed->text(), self::FAKE_HASH)]);
    }

    private function recordedHostExchange(): CutExchange
    {
        $recording = $this->app->make(Recordings::class)->scenario('claude-code', 'terminal-turn');

        return $recording->exchange($recording->exchangesOn(Wire::Host)[0]);
    }

    private function firstGuardHash(CutExchange $exchange): string
    {
        foreach ($exchange->events as $event) {
            $call = $event->call;

            if ($call === null || $event->type !== RecordedEventType::Answered || ! HostRoute::ClaimInstruction->matchesPath($call->path)) {
                continue;
            }

            foreach (HostClaimedInstructionsPayload::from($call->body)->instructions as $instruction) {
                $guard = $instruction->type === HostInstructionType::WriteKeys->value
                    ? HostKeyWritePayload::from($instruction->payload)->ifRows
                    : null;

                if ($guard !== null) {
                    return $guard->hash;
                }
            }
        }

        $this->fail('the recorded terminal turn writes no guarded keys');
    }
}
